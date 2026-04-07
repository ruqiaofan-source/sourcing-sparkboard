-- FIX 1: Realtime broadcast data leak - remove broad topic access
DROP POLICY IF EXISTS "Authenticated users can read own realtime messages" ON realtime.messages;

CREATE POLICY "Authenticated users can read own realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    WHERE realtime.topic() ~ ('^realtime:public:notifications:' || auth.uid()::text)
  )
);

-- FIX 2: Harden invoice trigger to block financial field tampering by customers
CREATE OR REPLACE FUNCTION protect_invoice_customer_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'agent') OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.factory_cost IS DISTINCT FROM OLD.factory_cost
     OR NEW.logistics_cost IS DISTINCT FROM OLD.logistics_cost
     OR NEW.service_fee IS DISTINCT FROM OLD.service_fee
     OR NEW.china_ops_cost IS DISTINCT FROM OLD.china_ops_cost
     OR NEW.financial_costs IS DISTINCT FROM OLD.financial_costs
     OR NEW.quantity IS DISTINCT FROM OLD.quantity
     OR NEW.invoice_number IS DISTINCT FROM OLD.invoice_number
     OR NEW.product_name IS DISTINCT FROM OLD.product_name
     OR NEW.factory_name IS DISTINCT FROM OLD.factory_name
     OR NEW.currency IS DISTINCT FROM OLD.currency
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.order_id IS DISTINCT FROM OLD.order_id
     OR NEW.quote_id IS DISTINCT FROM OLD.quote_id
     OR NEW.sourcing_request_id IS DISTINCT FROM OLD.sourcing_request_id
  THEN
    RAISE EXCEPTION 'Customers may only update payment_status on invoices';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_invoice_customer_updates ON public.invoices;
CREATE TRIGGER protect_invoice_customer_updates
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION protect_invoice_customer_updates();

-- FIX 3: Sourcing request self-referential subquery bug
DROP POLICY IF EXISTS "Customers can update own pending requests" ON public.sourcing_requests;

CREATE POLICY "Customers can update own pending requests"
ON public.sourcing_requests
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = user_id) AND (status = 'pending')
)
WITH CHECK (
  (auth.uid() = user_id)
  AND (status = 'pending')
  AND (NOT (agent_id IS DISTINCT FROM (
    SELECT sr.agent_id
    FROM sourcing_requests sr
    WHERE sr.id = sourcing_requests.id
  )))
);