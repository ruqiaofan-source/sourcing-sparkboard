INSERT INTO storage.buckets (id, name, public) VALUES ('insight-covers', 'insight-covers', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for insight covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'insight-covers');

CREATE POLICY "Service role can upload insight covers"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'insight-covers');