
DROP TRIGGER IF EXISTS protect_invoice_customer_updates_trigger ON public.invoices;
CREATE TRIGGER protect_invoice_customer_updates_trigger
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.protect_invoice_customer_updates();

DROP TRIGGER IF EXISTS protect_quote_financial_fields_trigger ON public.quotes;
CREATE TRIGGER protect_quote_financial_fields_trigger
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.protect_quote_financial_fields();
