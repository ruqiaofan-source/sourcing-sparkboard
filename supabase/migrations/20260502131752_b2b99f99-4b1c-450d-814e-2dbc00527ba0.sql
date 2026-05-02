-- Track per-user, per-request last-read timestamp
CREATE TABLE IF NOT EXISTS public.message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sourcing_request_id uuid NOT NULL,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, sourcing_request_id)
);

CREATE INDEX IF NOT EXISTS idx_message_reads_user ON public.message_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_request ON public.message_reads(sourcing_request_id);

ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own message reads"
  ON public.message_reads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own message reads"
  ON public.message_reads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own message reads"
  ON public.message_reads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_message_reads_updated_at
BEFORE UPDATE ON public.message_reads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RPC: mark a request as read up to now()
CREATE OR REPLACE FUNCTION public.mark_request_read(_request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.message_reads (user_id, sourcing_request_id, last_read_at)
  VALUES (auth.uid(), _request_id, now())
  ON CONFLICT (user_id, sourcing_request_id)
  DO UPDATE SET last_read_at = now(), updated_at = now();
END;
$$;

-- RPC: unread message counts per request for the current user.
-- Counts messages from other senders newer than the user's last_read_at.
-- If no read row exists yet, all foreign messages are considered unread.
CREATE OR REPLACE FUNCTION public.get_unread_message_counts()
RETURNS TABLE (sourcing_request_id uuid, unread_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.sourcing_request_id,
    COUNT(*)::bigint AS unread_count
  FROM public.messages m
  LEFT JOIN public.message_reads mr
    ON mr.sourcing_request_id = m.sourcing_request_id
   AND mr.user_id = auth.uid()
  WHERE m.sender_id <> auth.uid()
    AND (
      mr.last_read_at IS NULL
      OR m.created_at > mr.last_read_at
    )
    AND (
      -- Customers only see their own requests
      EXISTS (
        SELECT 1 FROM public.sourcing_requests sr
        WHERE sr.id = m.sourcing_request_id
          AND sr.user_id = auth.uid()
      )
      OR public.has_role(auth.uid(), 'agent'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  GROUP BY m.sourcing_request_id;
$$;