
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sourcing_request_id uuid NOT NULL REFERENCES public.sourcing_requests(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Customers can see messages on their own requests
CREATE POLICY "Customers see own request messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = messages.sourcing_request_id AND sr.user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'agent'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Authenticated users can send messages on requests they're involved in
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM public.sourcing_requests sr
        WHERE sr.id = messages.sourcing_request_id AND sr.user_id = auth.uid()
      )
      OR has_role(auth.uid(), 'agent'::app_role)
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
