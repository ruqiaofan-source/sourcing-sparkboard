
-- Drop the problematic view
DROP VIEW IF EXISTS public.suppliers_public;

-- Drop the agents-only policy
DROP POLICY IF EXISTS "Agents and admins can view suppliers" ON public.suppliers;

-- Allow all authenticated users to read suppliers (contact info hidden in UI for customers)
CREATE POLICY "Authenticated users can view suppliers"
ON public.suppliers FOR SELECT TO authenticated
USING (true);
