
-- 1. Add unique constraint on profiles.user_id so we can FK to it
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- 2. Add FK from sourcing_requests.user_id to profiles.user_id
ALTER TABLE public.sourcing_requests 
  ADD CONSTRAINT sourcing_requests_user_id_profiles_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- 3. Allow agents and admins to view all profiles (needed for showing customer names)
CREATE POLICY "Agents and admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'agent'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 4. Add sourcing-attachments storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('sourcing-attachments', 'sourcing-attachments', true);

-- 5. Storage RLS: authenticated users can upload files
CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sourcing-attachments');

-- 6. Storage RLS: anyone can view attachments (bucket is public)
CREATE POLICY "Anyone can view attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'sourcing-attachments');

-- 7. Add attachment_paths column to sourcing_requests
ALTER TABLE public.sourcing_requests ADD COLUMN attachment_paths jsonb DEFAULT '[]'::jsonb;

-- 8. Add attachment_paths column to quotes
ALTER TABLE public.quotes ADD COLUMN attachment_paths jsonb DEFAULT '[]'::jsonb;
