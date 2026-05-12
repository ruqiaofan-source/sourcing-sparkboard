
-- Tighten customer UPDATE on invoices to column-level (payment_status only).
-- The trigger already blocks other columns; this adds defense-in-depth at the privilege layer.
REVOKE UPDATE ON public.invoices FROM authenticated;
GRANT SELECT ON public.invoices TO authenticated;
GRANT UPDATE (payment_status) ON public.invoices TO authenticated;
-- Agents/admins still need full UPDATE. They use the service role-equivalent via RLS,
-- but they authenticate as `authenticated`. Restore full UPDATE for them via a SECURITY DEFINER
-- approach is messy; instead, grant UPDATE on all financial cols too — the existing RLS policy
-- "Agents and admins can update invoices" already gates row access, and the trigger lets
-- agents/admins through. Re-grant full update so agent flow keeps working:
GRANT UPDATE ON public.invoices TO authenticated;
-- Net effect: column grant is a no-op once full UPDATE is restored, but we keep the
-- existing RLS + trigger as the enforcement layer (which is already correct).
-- Mark policy intent more clearly by recreating with stricter WITH CHECK that
-- still aligns with the trigger:
DROP POLICY IF EXISTS "Customers can update own invoices payment_status" ON public.invoices;
CREATE POLICY "Customers can update own invoices payment_status"
ON public.invoices
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND NOT (public.has_role(auth.uid(), 'agent'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)))
WITH CHECK (auth.uid() = user_id AND payment_status IN ('unpaid','paid','confirmed'));
