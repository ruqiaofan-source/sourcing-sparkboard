
ALTER TABLE public.trending_products
  ADD COLUMN slug text UNIQUE,
  ADD COLUMN detailed_analysis jsonb DEFAULT '{}'::jsonb;

CREATE INDEX idx_trending_products_slug ON public.trending_products (slug) WHERE slug IS NOT NULL;
