ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';

-- Allow customers to update payment_status on their own invoices
CREATE POLICY "Customers can update payment status on own invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger to restrict customer updates to payment_status only
CREATE OR REPLACE FUNCTION public.protect_invoice_customer_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Customers can only change payment_status
  IF NEW.status IS DISTINCT FROM OLD.status
    OR NEW.total_amount IS DISTINCT FROM OLD.total_amount
    OR NEW.factory_cost IS DISTINCT FROM OLD.factory_cost
    OR NEW.service_fee IS DISTINCT FROM OLD.service_fee
    OR NEW.logistics_cost IS DISTINCT FROM OLD.logistics_cost
    OR NEW.china_ops_cost IS DISTINCT FROM OLD.china_ops_cost
    OR NEW.financial_costs IS DISTINCT FROM OLD.financial_costs
    OR NEW.invoice_number IS DISTINCT FROM OLD.invoice_number
    OR NEW.currency IS DISTINCT FROM OLD.currency
    OR NEW.quantity IS DISTINCT FROM OLD.quantity
    OR NEW.product_name IS DISTINCT FROM OLD.product_name
    OR NEW.factory_name IS DISTINCT FROM OLD.factory_name
    OR NEW.pdf_path IS DISTINCT FROM OLD.pdf_path
    OR NEW.user_id IS DISTINCT FROM OLD.user_id
  THEN
    RAISE EXCEPTION 'Customers can only update payment_status on invoices';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_invoice_customer_updates_trigger
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_invoice_customer_updates();