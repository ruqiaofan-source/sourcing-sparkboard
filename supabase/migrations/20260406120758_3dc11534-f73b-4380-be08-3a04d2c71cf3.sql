
-- FIX 1: Remove overly broad realtime channel access policy on messages
DROP POLICY IF EXISTS "Authenticated users can read own realtime messages" ON public.messages;

-- FIX 2: Tighten invoice customer update policy to only allow payment_status changes
-- The trigger protect_invoice_customer_updates already blocks other fields,
-- but we should also tighten the RLS policy WITH CHECK
DROP POLICY IF EXISTS "Customers can update payment_status on own invoices" ON public.invoices;
CREATE POLICY "Customers can update payment_status on own invoices"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = (SELECT status FROM public.invoices WHERE id = invoices.id)
    AND total_amount = (SELECT total_amount FROM public.invoices WHERE id = invoices.id)
    AND factory_cost = (SELECT factory_cost FROM public.invoices WHERE id = invoices.id)
    AND service_fee = (SELECT service_fee FROM public.invoices WHERE id = invoices.id)
    AND logistics_cost = (SELECT logistics_cost FROM public.invoices WHERE id = invoices.id)
    AND china_ops_cost = (SELECT china_ops_cost FROM public.invoices WHERE id = invoices.id)
    AND financial_costs = (SELECT financial_costs FROM public.invoices WHERE id = invoices.id)
    AND invoice_number = (SELECT invoice_number FROM public.invoices WHERE id = invoices.id)
    AND currency = (SELECT currency FROM public.invoices WHERE id = invoices.id)
    AND quantity = (SELECT quantity FROM public.invoices WHERE id = invoices.id)
    AND product_name = (SELECT product_name FROM public.invoices WHERE id = invoices.id)
    AND factory_name = (SELECT factory_name FROM public.invoices WHERE id = invoices.id)
    AND pdf_path IS NOT DISTINCT FROM (SELECT pdf_path FROM public.invoices WHERE id = invoices.id)
    AND user_id = (SELECT user_id FROM public.invoices WHERE id = invoices.id)
  );

-- FIX 3: Split sourcing_requests update policy
-- Remove the existing overly broad policy
DROP POLICY IF EXISTS "Agents and admins can update requests" ON public.sourcing_requests;

-- Create agent/admin update policy (unrestricted)
CREATE POLICY "Agents and admins can update requests"
  ON public.sourcing_requests
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));

-- Create restricted customer update policy (only user-editable fields, only while pending)
CREATE POLICY "Customers can update own pending requests"
  ON public.sourcing_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND agent_id IS NOT DISTINCT FROM (SELECT agent_id FROM public.sourcing_requests WHERE id = sourcing_requests.id)
  );

-- FIX 4: Remove self-insert from notifications policy
DROP POLICY IF EXISTS "Service and agents can insert notifications" ON public.notifications;
CREATE POLICY "Agents and admins can insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));

-- FIX 6: Fix suppressed_emails, email_send_log, email_send_state, email_unsubscribe_tokens
-- to use proper role grants instead of auth.role() checks

-- suppressed_emails
DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
DROP POLICY IF EXISTS "Service role can read suppressed emails" ON public.suppressed_emails;
CREATE POLICY "Service role can insert suppressed emails" ON public.suppressed_emails FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can read suppressed emails" ON public.suppressed_emails FOR SELECT TO service_role USING (true);

-- email_send_log
DROP POLICY IF EXISTS "Service role can insert send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can update send log" ON public.email_send_log;
CREATE POLICY "Service role can insert send log" ON public.email_send_log FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can read send log" ON public.email_send_log FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can update send log" ON public.email_send_log FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- email_send_state
DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;
CREATE POLICY "Service role can manage send state" ON public.email_send_state FOR ALL TO service_role USING (true) WITH CHECK (true);

-- email_unsubscribe_tokens
DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can mark tokens as used" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can read tokens" ON public.email_unsubscribe_tokens;
CREATE POLICY "Service role can insert tokens" ON public.email_unsubscribe_tokens FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can mark tokens as used" ON public.email_unsubscribe_tokens FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can read tokens" ON public.email_unsubscribe_tokens FOR SELECT TO service_role USING (true);
