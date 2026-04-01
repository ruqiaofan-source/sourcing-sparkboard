-- Restrict supplier contact details to agents and admins only
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

CREATE POLICY "Agents and admins can view suppliers"
ON public.suppliers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));