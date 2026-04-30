-- 1. Invoices: column-level UPDATE for customers (only payment_status)
DROP POLICY IF EXISTS "Customers can update payment_status on own invoices" ON public.invoices;

CREATE POLICY "Customers can update own invoices payment_status"
ON public.invoices
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Restrict authenticated UPDATE to payment_status only via column-level privileges
REVOKE UPDATE ON public.invoices FROM authenticated;
GRANT UPDATE (payment_status) ON public.invoices TO authenticated;
-- Agents/admins update via service-role-equivalent context already covered by their policy + we re-grant full update via a helper: keep table-level UPDATE for postgres/service_role only.
-- Agents and admins use the regular postgres/authenticated session too; restore broad column update for them via a SECURITY DEFINER not needed —
-- instead, give authenticated full column update but rely on the protect_invoice_customer_updates trigger to block customer changes to other columns.
GRANT UPDATE ON public.invoices TO authenticated;

-- Ensure the protect trigger exists (function already defined). Recreate trigger idempotently.
DROP TRIGGER IF EXISTS protect_invoice_customer_updates_trg ON public.invoices;
CREATE TRIGGER protect_invoice_customer_updates_trg
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.protect_invoice_customer_updates();

-- 2. Notifications: agents can only notify customers tied to their assigned sourcing requests
DROP POLICY IF EXISTS "Agents and admins can insert notifications" ON public.notifications;

CREATE POLICY "Admins can insert any notification"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can insert notifications for assigned customers"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'agent'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.sourcing_requests sr
    WHERE sr.user_id = notifications.user_id
      AND sr.agent_id = auth.uid()
  )
);

-- 3. Sourcing-attachments storage: agents only see attachments for assigned requests
DROP POLICY IF EXISTS "Agents can read sourcing attachments" ON storage.objects;
DROP POLICY IF EXISTS "Agents and admins can read sourcing attachments" ON storage.objects;
DROP POLICY IF EXISTS "Agents can view sourcing attachments" ON storage.objects;

CREATE POLICY "Admins can read all sourcing attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'sourcing-attachments'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Agents can read assigned sourcing attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'sourcing-attachments'
  AND public.has_role(auth.uid(), 'agent'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.sourcing_requests sr
    WHERE sr.agent_id = auth.uid()
      AND (
        position(sr.id::text in storage.objects.name) > 0
      )
  )
);

-- 4. Revoke public/anon/authenticated EXECUTE on internal SECURITY DEFINER functions.
-- They continue to run inside triggers and inside RLS policies (definer context bypasses EXECUTE checks for the caller of the trigger/policy).
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_generate_insight_seo() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_invoice_customer_updates() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_quote_financial_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
-- has_role is used inside RLS policies. The policy executes in definer/owner context, so revoking the caller-side EXECUTE is safe.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
-- Keep authenticated EXECUTE on has_role so client-side self-checks still work (function already restricts cross-user lookups).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;