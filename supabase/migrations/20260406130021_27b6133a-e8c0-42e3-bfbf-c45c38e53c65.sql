CREATE OR REPLACE FUNCTION public.promote_user_to_admin_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  SELECT user_id INTO _user_id
  FROM public.profiles
  WHERE lower(email) = lower(_email)
  LIMIT 1;

  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'No profile found for email %', _email;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;