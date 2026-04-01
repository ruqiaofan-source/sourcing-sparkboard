
-- Add linking columns to orders
ALTER TABLE public.orders 
  ADD COLUMN sourcing_request_id uuid REFERENCES public.sourcing_requests(id),
  ADD COLUMN quote_id uuid REFERENCES public.quotes(id);

-- Allow agents and admins to view all orders
CREATE POLICY "Agents and admins can view all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));

-- Allow agents and admins to update orders
CREATE POLICY "Agents and admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'agent') OR has_role(auth.uid(), 'admin'));
