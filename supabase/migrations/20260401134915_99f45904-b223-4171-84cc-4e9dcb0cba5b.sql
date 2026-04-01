
-- 1. Remove the "Users can create own invoices" INSERT policy
DROP POLICY IF EXISTS "Users can create own invoices" ON public.invoices;

-- 2. Fix quote manipulation: replace customer UPDATE policy with restricted one
DROP POLICY IF EXISTS "Customers can accept or reject quotes" ON public.quotes;

CREATE POLICY "Customers can accept or reject quotes" ON public.quotes
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM sourcing_requests sr
    WHERE sr.id = quotes.sourcing_request_id AND sr.user_id = auth.uid()
  )
)
WITH CHECK (
  status IN ('accepted', 'rejected')
);

-- 3. Add explicit INSERT policy for user_roles (admins only)
CREATE POLICY "Only admins can insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Make sourcing-attachments bucket private
UPDATE storage.buckets SET public = false WHERE id = 'sourcing-attachments';

-- 5. Drop existing broad storage SELECT policy and replace with scoped one
DROP POLICY IF EXISTS "Anyone can view attachments" ON storage.objects;

CREATE POLICY "Authenticated users can view own or admin attachments" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'sourcing-attachments'
  AND (
    public.has_role(auth.uid(), 'agent'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR (owner_id IS NOT NULL AND owner_id::text = auth.uid()::text)
  )
);
