ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS invoice_id uuid;
CREATE INDEX IF NOT EXISTS idx_messages_invoice_id ON public.messages(invoice_id);