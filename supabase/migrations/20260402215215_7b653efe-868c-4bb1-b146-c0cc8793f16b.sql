
DROP POLICY IF EXISTS "Authenticated users can read own realtime messages" ON public.messages;

CREATE POLICY "Users can read own scoped realtime messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    (EXISTS (
      SELECT 1
      FROM sourcing_requests sr
      WHERE sr.id = messages.sourcing_request_id AND sr.user_id = auth.uid()
    ))
    OR has_role(auth.uid(), 'agent'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  );
