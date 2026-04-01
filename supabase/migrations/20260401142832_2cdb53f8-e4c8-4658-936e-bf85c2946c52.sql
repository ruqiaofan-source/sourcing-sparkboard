INSERT INTO public.user_roles (user_id, role)
VALUES ('5510aa87-02f5-4874-83ff-bcf087bb63c9', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;