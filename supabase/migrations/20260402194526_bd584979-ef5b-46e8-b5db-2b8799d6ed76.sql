CREATE TRIGGER protect_invoice_customer_updates
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_invoice_customer_updates();