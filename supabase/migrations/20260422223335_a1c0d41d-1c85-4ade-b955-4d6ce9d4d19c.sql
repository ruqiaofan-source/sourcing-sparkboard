
-- Attach the existing protect_invoice_customer_updates trigger function
CREATE TRIGGER trg_protect_invoice_customer_updates
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_invoice_customer_updates();

-- Attach the existing protect_quote_financial_fields trigger function  
CREATE TRIGGER trg_protect_quote_financial_fields
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_quote_financial_fields();

-- Attach updated_at triggers
CREATE TRIGGER trg_updated_at_invoices
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_quotes
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_agents
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_sourcing_requests
  BEFORE UPDATE ON public.sourcing_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Remove the misplaced realtime messages policy on the messages table
DROP POLICY IF EXISTS "Authenticated users can read own realtime messages" ON public.messages;

-- First admin trigger on profiles (IF NOT EXISTS to avoid conflict)
DROP TRIGGER IF EXISTS trg_first_admin ON public.profiles;
CREATE TRIGGER trg_first_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_admin();
