
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tag TEXT NOT NULL DEFAULT 'Blog',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  author_name TEXT DEFAULT 'Equilinq Team',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Anyone can read published insights
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published insights"
ON public.insights FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage insights"
ON public.insights FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed existing blog posts
INSERT INTO public.insights (title, slug, excerpt, cover_image_url, tag, published, published_at) VALUES
('The Global eCommerce Giants You''ve Probably Never Used', 'the-global-ecommerce-giants-youve-probably-never-used', 'When people talk about the world''s largest eCommerce platforms, the same names usually appear: Amazon, eBay, or Shopify. However, the Global eCommerce Outlook 2026 published by ECDB paints a very different picture. Several of the largest platforms in the world are not based in the West.', 'https://framerusercontent.com/images/mfGD3xxyD3pBZOCH0fmBY8wsKw.jpeg?width=1280&height=708', 'Blog', true, '2026-02-27T00:00:00Z'),
('Germany''s Largest Second-Hand Marketplace Introduces AI Search', 'germanys-largest-second-hand-marketplace-introduces-ai-search', 'Germany''s largest classifieds and second-hand marketplace, Kleinanzeigen, recently introduced AI-powered search using ChatGPT. Instead of relying on traditional keywords, users can now describe what they are looking for in natural language.', 'https://framerusercontent.com/images/Ookguc8yejFLpR4ndHuSUkh1ag.jpeg?width=1800&height=1012', 'Blog', true, '2026-02-17T00:00:00Z'),
('Amazon''s 2026 Return Rule: Faster Refunds, Higher Risk for Sellers', 'amazon-2026-return-rule-risks-for-sellers', 'Amazon is introducing major changes to its returns and refund process in 2026. The new policy focuses on faster refunds and a more streamlined buyer experience, but increases financial and operational risks for sellers.', 'https://framerusercontent.com/images/M3G247KjmZn2u9oGjXDOW7zqOk.jpg?width=949&height=360', 'Blog', true, '2026-02-10T00:00:00Z'),
('OEM Manufacturing: How to Avoid the 3 Biggest Mistakes New E-commerce Brands Make', 'oem-manufacturing-how-to-avoid-the-3-biggest-mistakes', 'Launching an OEM product can be a powerful way to build a brand, but sourcing mistakes during manufacturing can quickly turn a promising idea into a costly failure. Decisions made early in the sourcing process can have a major impact.', 'https://framerusercontent.com/images/z8Fol40VXmlLsewPoh2gmkKTvo.jpg?width=1500&height=1001', 'Blog', true, '2026-01-04T00:00:00Z');
