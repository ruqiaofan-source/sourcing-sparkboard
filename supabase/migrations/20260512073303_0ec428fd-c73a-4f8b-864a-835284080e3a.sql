-- Audit table for customer-declared "transfer completed" events
CREATE TABLE public.transfer_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid NOT NULL,
  sourcing_request_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message_id uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transfer_events_invoice ON public.transfer_events(invoice_id);
CREATE INDEX idx_transfer_events_request ON public.transfer_events(sourcing_request_id);

ALTER TABLE public.transfer_events ENABLE ROW LEVEL SECURITY;

-- Customers can record their own event for their own invoice
CREATE POLICY "Customers insert own transfer events"
ON public.transfer_events
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id = invoice_id AND i.user_id = auth.uid()
  )
);

-- Customers can view their own events
CREATE POLICY "Customers view own transfer events"
ON public.transfer_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Agents/admins can view all
CREATE POLICY "Agents and admins view all transfer events"
ON public.transfer_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
