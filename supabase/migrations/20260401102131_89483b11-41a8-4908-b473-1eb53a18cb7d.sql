
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  on_time_percentage NUMERIC(4,1) NOT NULL DEFAULT 0,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('verified', 'pending_review')),
  since_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  moq TEXT NOT NULL,
  unit_price TEXT NOT NULL,
  lead_time_days INTEGER NOT NULL DEFAULT 14,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'made_to_order')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  product_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('in_transit', 'processing', 'delivered', 'qc_review')),
  eta DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed suppliers
INSERT INTO public.suppliers (name, location, country, category, rating, total_orders, on_time_percentage, contact_email, contact_phone, status, since_year) VALUES
  ('Shenzhen Tech Co.', 'Shenzhen, China', 'China', 'Electronics', 4.8, 48, 97.0, 'li.wei@shenzhentech.cn', '+86 755 8888 1234', 'verified', 2023),
  ('Mumbai Textiles Ltd.', 'Mumbai, India', 'India', 'Textiles', 4.5, 32, 92.0, 'raj@mumbaitextiles.in', '+91 22 4567 8900', 'verified', 2024),
  ('Istanbul Metals', 'Istanbul, Turkey', 'Turkey', 'Raw Materials', 4.7, 27, 95.0, 'ahmet@istanbulmetals.tr', '+90 212 555 6789', 'verified', 2023),
  ('São Paulo Agri', 'São Paulo, Brazil', 'Brazil', 'Agriculture', 4.3, 21, 89.0, 'carlos@spagri.br', '+55 11 9876 5432', 'pending_review', 2025),
  ('Hanoi Ceramics', 'Hanoi, Vietnam', 'Vietnam', 'Home & Decor', 4.6, 18, 94.0, 'nguyen@hanoiceramics.vn', '+84 24 3456 7890', 'verified', 2024),
  ('Guangzhou Electronics', 'Guangzhou, China', 'China', 'Electronics', 4.4, 35, 91.0, 'zhang@gzelectronics.cn', '+86 20 7777 8888', 'verified', 2022),
  ('Bangkok Rubber Co.', 'Bangkok, Thailand', 'Thailand', 'Raw Materials', 4.2, 15, 88.0, 'somchai@bkkrubber.th', '+66 2 345 6789', 'verified', 2024),
  ('Jakarta Woodworks', 'Jakarta, Indonesia', 'Indonesia', 'Furniture', 4.1, 12, 86.0, 'budi@jakartawood.id', '+62 21 8765 4321', 'pending_review', 2025);

-- Seed products (need supplier IDs)
INSERT INTO public.products (name, sku, category, supplier_id, moq, unit_price, lead_time_days, stock_status)
SELECT 'PCB Assembly Board v3', 'PCB-003', 'Electronics', id, '500 units', '$4.90', 14, 'in_stock' FROM public.suppliers WHERE name = 'Shenzhen Tech Co.'
UNION ALL
SELECT 'Cotton Fabric Roll (White)', 'CTN-W01', 'Textiles', id, '100 yards', '$3.60/yd', 18, 'in_stock' FROM public.suppliers WHERE name = 'Mumbai Textiles Ltd.'
UNION ALL
SELECT '304 Stainless Steel Sheet', 'SS-304', 'Raw Materials', id, '200 kg', '$16.00/kg', 12, 'low_stock' FROM public.suppliers WHERE name = 'Istanbul Metals'
UNION ALL
SELECT 'Arabica Coffee Beans (Organic)', 'CFE-ARB', 'Agriculture', id, '1 ton', '$8,000/ton', 21, 'in_stock' FROM public.suppliers WHERE name = 'São Paulo Agri'
UNION ALL
SELECT 'Porcelain Floor Tile 60x60', 'PRC-60', 'Home & Decor', id, '200 sqm', '$6.00/sqm', 16, 'in_stock' FROM public.suppliers WHERE name = 'Hanoi Ceramics'
UNION ALL
SELECT '5050 LED Strip Light (RGB)', 'LED-RGB', 'Electronics', id, '1,000 units', '$1.50', 10, 'in_stock' FROM public.suppliers WHERE name = 'Guangzhou Electronics'
UNION ALL
SELECT 'Natural Rubber Sheet 3mm', 'RBR-3M', 'Raw Materials', id, '500 kg', '$3.50/kg', 15, 'low_stock' FROM public.suppliers WHERE name = 'Bangkok Rubber Co.'
UNION ALL
SELECT 'Teak Dining Chair Frame', 'TK-DCF', 'Furniture', id, '50 sets', '$85.00', 25, 'made_to_order' FROM public.suppliers WHERE name = 'Jakarta Woodworks'
UNION ALL
SELECT 'ESP32 Microcontroller Board', 'ESP-32', 'Electronics', id, '200 units', '$17.00', 10, 'in_stock' FROM public.suppliers WHERE name = 'Shenzhen Tech Co.'
UNION ALL
SELECT 'Silk Scarf (Custom Print)', 'SLK-CP', 'Textiles', id, '100 units', '$9.00', 20, 'made_to_order' FROM public.suppliers WHERE name = 'Mumbai Textiles Ltd.'
UNION ALL
SELECT 'Copper Wire 2.5mm', 'CW-25', 'Raw Materials', id, '100 kg', '$12.00/kg', 14, 'in_stock' FROM public.suppliers WHERE name = 'Istanbul Metals'
UNION ALL
SELECT 'Ceramic Vase (Handcrafted)', 'CV-HC', 'Home & Decor', id, '100 units', '$14.00', 18, 'in_stock' FROM public.suppliers WHERE name = 'Hanoi Ceramics';
