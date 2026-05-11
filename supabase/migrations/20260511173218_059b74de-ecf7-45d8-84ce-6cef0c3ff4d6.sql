ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS message_type text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_messages_quote_id
  ON public.messages (quote_id)
  WHERE quote_id IS NOT NULL;