
-- Fix security definer view
DROP VIEW IF EXISTS public.suppliers_public;
CREATE VIEW public.suppliers_public
WITH (security_invoker = true)
AS
SELECT id, name, location, country, category, status, rating, on_time_percentage, total_orders, since_year, created_at, updated_at
FROM public.suppliers;
