
-- 1. Replace has_role() with a guarded version that prevents cross-user enumeration
-- Non-admin users can only check their own role; admins can check anyone
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow self-checks always
  IF _user_id = auth.uid() THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
    );
  END IF;
  
  -- Allow admins to check other users
  IF EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
    );
  END IF;
  
  -- Non-admins checking other users: return false (no info leaked)
  RETURN FALSE;
END;
$$;

-- 2. Scope agent profile access to only profiles associated with their assigned sourcing requests
DROP POLICY IF EXISTS "Agents and admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view assigned customer profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent') AND (
    user_id IN (
      SELECT sr.user_id FROM public.sourcing_requests sr WHERE sr.agent_id = auth.uid()
    )
  )
);
