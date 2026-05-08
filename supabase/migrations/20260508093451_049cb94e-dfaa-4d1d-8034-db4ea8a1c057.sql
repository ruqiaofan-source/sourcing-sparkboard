CREATE POLICY "Customers can read attachments on own request messages"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'sourcing-attachments'
  AND (storage.foldername(name))[2] = 'messages'
  AND EXISTS (
    SELECT 1 FROM public.sourcing_requests sr
    WHERE sr.user_id = auth.uid()
      AND (storage.foldername(name))[3] = sr.id::text
  )
);