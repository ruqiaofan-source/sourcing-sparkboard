
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS buckydrop_order_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS buckydrop_tracking_number text,
  ADD COLUMN IF NOT EXISTS buckydrop_status text,
  ADD COLUMN IF NOT EXISTS buckydrop_synced_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_buckydrop_order_id ON public.orders (buckydrop_order_id);
