-- 1. Restrict notifications visibility for agents
DROP POLICY IF EXISTS "Agents can view all notifications" ON public.notifications;

CREATE POLICY "Agents can view notifications for their assigned customers"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.sourcing_requests sr
    WHERE sr.agent_id = auth.uid()
      AND sr.user_id = notifications.user_id
  )
);

CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Replace substring path match with exact folder segment match for agent storage access
DROP POLICY IF EXISTS "Agents can read assigned sourcing attachments" ON storage.objects;

CREATE POLICY "Agents can read assigned sourcing attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'sourcing-attachments'
  AND has_role(auth.uid(), 'agent'::app_role)
  AND EXISTS (
    SELECT 1
    FROM public.sourcing_requests sr
    WHERE sr.agent_id = auth.uid()
      AND (storage.foldername(objects.name)) @> ARRAY[sr.id::text]
  )
);

-- 3. Lock down internal SECURITY DEFINER functions
-- Email pgmq helpers: only service role should call these
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- Admin promotion: only callable from server-side / admin contexts
REVOKE ALL ON FUNCTION public.promote_user_to_admin_by_email(text) FROM PUBLIC, anon, authenticated;

-- Trigger-only functions: never directly callable
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_generate_insight_seo() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_quote_financial_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_invoice_customer_updates() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_message_updates() FROM PUBLIC, anon, authenticated;