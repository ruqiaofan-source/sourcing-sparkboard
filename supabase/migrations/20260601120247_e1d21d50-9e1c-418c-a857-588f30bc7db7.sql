
-- addresses
DROP POLICY IF EXISTS "Agents and admins can view addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses" ON public.addresses
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view assigned customer addresses" ON public.addresses
  FOR SELECT USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.user_id = addresses.user_id AND sr.agent_id = auth.uid()
    )
  );

-- contact_submissions: admin only
DROP POLICY IF EXISTS "Agents can read contact submissions" ON public.contact_submissions;

-- invoices
DROP POLICY IF EXISTS "Agents and admins can view all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Agents and admins can update invoices" ON public.invoices;
CREATE POLICY "Admins can view all invoices" ON public.invoices
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all invoices" ON public.invoices
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view assigned invoices" ON public.invoices
  FOR SELECT USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = invoices.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );
CREATE POLICY "Agents can update assigned invoices" ON public.invoices
  FOR UPDATE USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = invoices.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );

-- messages
DROP POLICY IF EXISTS "Customers see own request messages" ON public.messages;
DROP POLICY IF EXISTS "Users can read own scoped realtime messages" ON public.messages;
CREATE POLICY "Customers see own request messages" ON public.messages
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = messages.sourcing_request_id
        AND (sr.user_id = auth.uid() OR sr.agent_id = auth.uid())
    )
  );
CREATE POLICY "Users can read own scoped realtime messages" ON public.messages
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = messages.sourcing_request_id
        AND (sr.user_id = auth.uid() OR sr.agent_id = auth.uid())
    )
  );

-- orders
DROP POLICY IF EXISTS "Agents and admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Agents and admins can update orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view assigned orders" ON public.orders
  FOR SELECT USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = orders.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );
CREATE POLICY "Agents can update assigned orders" ON public.orders
  FOR UPDATE USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = orders.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );

-- profiles
DROP POLICY IF EXISTS "Agents can view all profiles" ON public.profiles;
CREATE POLICY "Agents can view assigned customer profiles" ON public.profiles
  FOR SELECT USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.user_id = profiles.user_id AND sr.agent_id = auth.uid()
    )
  );

-- quotes
DROP POLICY IF EXISTS "Agents and admins can view quotes" ON public.quotes;
DROP POLICY IF EXISTS "Agents and admins can update quotes" ON public.quotes;
CREATE POLICY "Quotes visibility" ON public.quotes
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = quotes.sourcing_request_id
        AND (sr.user_id = auth.uid() OR sr.agent_id = auth.uid())
    )
  );
CREATE POLICY "Admins can update all quotes" ON public.quotes
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can update assigned quotes" ON public.quotes
  FOR UPDATE USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = quotes.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );

-- sourcing_requests
DROP POLICY IF EXISTS "Customers can view own requests" ON public.sourcing_requests;
DROP POLICY IF EXISTS "Agents and admins can update requests" ON public.sourcing_requests;
CREATE POLICY "Requests visibility" ON public.sourcing_requests
  FOR SELECT USING (
    auth.uid() = user_id
    OR has_role(auth.uid(), 'admin'::app_role)
    OR (has_role(auth.uid(), 'agent'::app_role) AND agent_id = auth.uid())
  );
CREATE POLICY "Admins can update all requests" ON public.sourcing_requests
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can update assigned requests" ON public.sourcing_requests
  FOR UPDATE USING (
    has_role(auth.uid(), 'agent'::app_role) AND agent_id = auth.uid()
  );

-- transfer_events
DROP POLICY IF EXISTS "Agents and admins view all transfer events" ON public.transfer_events;
CREATE POLICY "Admins view all transfer events" ON public.transfer_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents view assigned transfer events" ON public.transfer_events
  FOR SELECT USING (
    has_role(auth.uid(), 'agent'::app_role) AND EXISTS (
      SELECT 1 FROM public.sourcing_requests sr
      WHERE sr.id = transfer_events.sourcing_request_id AND sr.agent_id = auth.uid()
    )
  );
