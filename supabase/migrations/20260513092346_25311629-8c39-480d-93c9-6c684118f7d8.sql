
-- 1. Remove customer self-confirm payment policy. Customers report transfers via transfer_events; staff confirm payment.
DROP POLICY IF EXISTS "Customers can mark own invoice as paid" ON public.invoices;

-- 2. Lock down internal SECURITY DEFINER functions that should never be called from the client.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin_by_email(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_quote_financial_fields() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_invoice_customer_updates() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_message_updates() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_generate_insight_seo() FROM anon, authenticated;
