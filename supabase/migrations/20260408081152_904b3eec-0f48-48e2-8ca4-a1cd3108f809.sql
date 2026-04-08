
DROP POLICY IF EXISTS "Agents can view assigned customer profiles" ON public.profiles;

CREATE POLICY "Agents can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent'));
