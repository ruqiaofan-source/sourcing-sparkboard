
ALTER TABLE public.invoices ADD COLUMN financial_costs numeric NOT NULL DEFAULT 0;

CREATE POLICY "Agents and admins can update invoices" ON public.invoices
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'agent'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents and admins can create invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'agent'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
