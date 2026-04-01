
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id),
  quote_id uuid REFERENCES public.quotes(id),
  sourcing_request_id uuid REFERENCES public.sourcing_requests(id),
  user_id uuid NOT NULL,
  invoice_number text NOT NULL,
  factory_cost numeric NOT NULL DEFAULT 0,
  china_ops_cost numeric NOT NULL DEFAULT 0,
  logistics_cost numeric NOT NULL DEFAULT 0,
  service_fee numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  quantity integer NOT NULL DEFAULT 1,
  product_name text NOT NULL DEFAULT '',
  factory_name text NOT NULL DEFAULT '',
  delivery_address text,
  status text NOT NULL DEFAULT 'issued',
  pdf_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents and admins can view all invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));
