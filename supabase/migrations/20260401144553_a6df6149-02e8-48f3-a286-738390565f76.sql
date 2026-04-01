
-- 1. Remove old overly permissive storage INSERT policy
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;

-- 2. Fix user_roles: add RESTRICTIVE INSERT policy to block non-admins
CREATE POLICY "Only admins can insert user roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin')
);

-- 3. Allow agents and admins to create orders
CREATE POLICY "Agents and admins can create orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin')
);
