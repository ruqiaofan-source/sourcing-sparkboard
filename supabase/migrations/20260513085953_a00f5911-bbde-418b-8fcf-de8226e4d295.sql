CREATE POLICY "Customers can read quote attachments on own requests"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sourcing-attachments'
  AND (storage.foldername(name))[2] = 'quotes'
  AND EXISTS (
    SELECT 1 FROM public.sourcing_requests sr
    WHERE sr.user_id = auth.uid()
      AND (storage.foldername(objects.name))[3] = sr.id::text
  )
);