-- Add restrictive UPDATE policy: only admins can update roles
CREATE POLICY "Only admins can update user roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add restrictive DELETE policy: only admins can delete roles
CREATE POLICY "Only admins can delete user roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));