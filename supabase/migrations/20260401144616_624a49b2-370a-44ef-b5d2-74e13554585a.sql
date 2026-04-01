
-- Recreate view without security_invoker so it works for all authenticated users
-- The view itself excludes contact_email and contact_phone
DROP VIEW IF EXISTS public.suppliers_public;
CREATE VIEW public.suppliers_public AS
SELECT id, name, location, country, category, status, rating, on_time_percentage, total_orders, since_year, created_at, updated_at
FROM public.suppliers;

-- Grant SELECT on the view to authenticated
GRANT SELECT ON public.suppliers_public TO authenticated;
GRANT SELECT ON public.suppliers_public TO anon;
