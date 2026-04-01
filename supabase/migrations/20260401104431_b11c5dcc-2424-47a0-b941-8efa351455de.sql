
-- Quotes table with Equilinq transparent pricing structure
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_request_id UUID REFERENCES public.sourcing_requests(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES auth.users(id) NOT NULL,
  factory_name TEXT NOT NULL DEFAULT '',
  factory_cost NUMERIC NOT NULL DEFAULT 0,
  china_ops_cost NUMERIC NOT NULL DEFAULT 0,
  logistics_cost NUMERIC NOT NULL DEFAULT 0,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_time_days INTEGER NOT NULL DEFAULT 14,
  moq INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Agents/admins can create quotes
CREATE POLICY "Agents can create quotes" ON public.quotes
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'agent') OR public.has_role(auth.uid(), 'admin'));

-- Agents/admins can view all quotes
CREATE POLICY "Agents and admins can view quotes" ON public.quotes
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'agent') 
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.sourcing_requests sr 
      WHERE sr.id = sourcing_request_id AND sr.user_id = auth.uid()
    )
  );

-- Agents/admins can update quotes
CREATE POLICY "Agents and admins can update quotes" ON public.quotes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'agent') OR public.has_role(auth.uid(), 'admin'));

-- Customers can update quote status (accept/reject)
CREATE POLICY "Customers can accept or reject quotes" ON public.quotes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sourcing_requests sr 
      WHERE sr.id = sourcing_request_id AND sr.user_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for sourcing_requests and quotes
ALTER PUBLICATION supabase_realtime ADD TABLE public.sourcing_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
