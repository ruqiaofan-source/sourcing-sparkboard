
-- 1. Fix storage upload: restrict to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload sourcing attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload sourcing attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'sourcing-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Also add DELETE/UPDATE policies for file owners and admins
CREATE POLICY "Users can delete own sourcing attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'sourcing-attachments' AND
  owner_id = auth.uid()::text
);

CREATE POLICY "Users can update own sourcing attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'sourcing-attachments' AND
  owner_id = auth.uid()::text
);

-- 2. Fix quote field manipulation: trigger to prevent customers from changing financial fields
CREATE OR REPLACE FUNCTION public.protect_quote_financial_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is agent or admin, allow all changes
  IF has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- For customers: only status can change
  IF NEW.factory_cost IS DISTINCT FROM OLD.factory_cost
    OR NEW.china_ops_cost IS DISTINCT FROM OLD.china_ops_cost
    OR NEW.logistics_cost IS DISTINCT FROM OLD.logistics_cost
    OR NEW.service_fee IS DISTINCT FROM OLD.service_fee
    OR NEW.total_cost IS DISTINCT FROM OLD.total_cost
    OR NEW.factory_name IS DISTINCT FROM OLD.factory_name
    OR NEW.moq IS DISTINCT FROM OLD.moq
    OR NEW.delivery_time_days IS DISTINCT FROM OLD.delivery_time_days
    OR NEW.currency IS DISTINCT FROM OLD.currency
    OR NEW.notes IS DISTINCT FROM OLD.notes
    OR NEW.addon_fees IS DISTINCT FROM OLD.addon_fees
    OR NEW.agent_id IS DISTINCT FROM OLD.agent_id
    OR NEW.sourcing_request_id IS DISTINCT FROM OLD.sourcing_request_id
    OR NEW.attachment_paths IS DISTINCT FROM OLD.attachment_paths
  THEN
    RAISE EXCEPTION 'Customers can only update the status field on quotes';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_quote_fields
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.protect_quote_financial_fields();

-- 3. Fix supplier contact exposure: replace open SELECT with role-restricted policy
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

CREATE POLICY "Agents and admins can view all supplier details"
ON public.suppliers FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin')
);

-- Customers can see suppliers but not contact info - we handle this via a view
CREATE POLICY "Customers can view suppliers basic info"
ON public.suppliers FOR SELECT TO authenticated
USING (true);

-- Actually we can't have two permissive SELECT policies that overlap.
-- Drop both and use a single policy that allows all authenticated to see.
-- We'll restrict contact fields via a database view instead.
DROP POLICY IF EXISTS "Agents and admins can view all supplier details" ON public.suppliers;
DROP POLICY IF EXISTS "Customers can view suppliers basic info" ON public.suppliers;

-- Allow all authenticated to SELECT (contact info hidden in code for customers)
CREATE POLICY "Agents and admins can view suppliers"
ON public.suppliers FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin')
);

-- Create a view for customers without contact details
CREATE OR REPLACE VIEW public.suppliers_public AS
SELECT id, name, location, country, category, status, rating, on_time_percentage, total_orders, since_year, created_at, updated_at
FROM public.suppliers;

-- 4. Fix function search paths for email queue functions
CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$$;
