
-- 1. Fix invoice customer update policy (self-referential subquery bug)
DROP POLICY IF EXISTS "Customers can update payment_status on own invoices" ON public.invoices;

CREATE POLICY "Customers can update payment_status on own invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- The BEFORE UPDATE trigger protect_invoice_customer_updates already blocks
-- customers from modifying any field except payment_status.

-- 2. Remove overly broad realtime topic access policy from messages
DROP POLICY IF EXISTS "Authenticated users can read own realtime messages" ON public.messages;

-- 3. Remove redundant permissive INSERT policy on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
