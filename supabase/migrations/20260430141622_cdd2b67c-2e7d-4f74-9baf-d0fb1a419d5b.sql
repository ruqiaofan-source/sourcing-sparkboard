-- Allow agents to view all notifications (read-only) for support context
CREATE POLICY "Agents can view all notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent'::app_role));

-- Allow agents to view contact form submissions to follow up on leads
CREATE POLICY "Agents can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent'::app_role));