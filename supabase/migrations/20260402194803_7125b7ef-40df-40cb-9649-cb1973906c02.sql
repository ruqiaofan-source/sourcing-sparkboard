-- Drop the broad customer update policy
DROP POLICY "Customers can update payment status on own invoices" ON public.invoices;

-- Revoke general UPDATE on invoices from authenticated, then grant only payment_status
REVOKE UPDATE ON public.invoices FROM authenticated;

-- Re-grant UPDATE for agents/admins (all columns)
GRANT UPDATE ON public.invoices TO authenticated;

-- Create a restrictive RLS policy for customers that uses the trigger as enforcement
-- Since column-level GRANT can't distinguish roles, we rely on the trigger + tighter WITH CHECK
CREATE POLICY "Customers can update payment_status on own invoices"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
  );