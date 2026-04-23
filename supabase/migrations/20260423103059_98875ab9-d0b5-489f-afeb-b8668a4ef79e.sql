
CREATE TABLE public.trending_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source text NOT NULL DEFAULT 'TikTok Shop',
  source_url text,
  image_url text,
  category text NOT NULL DEFAULT 'General',
  price_range text,
  trend_score integer NOT NULL DEFAULT 1,
  description text,
  scraped_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.trending_products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active trending products (public feature)
CREATE POLICY "Anyone can view active trending products"
ON public.trending_products
FOR SELECT
TO public
USING (is_active = true);

-- Only service role can manage trending products
CREATE POLICY "Service role can manage trending products"
ON public.trending_products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_trending_products_updated_at
BEFORE UPDATE ON public.trending_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
