ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS attachment_paths jsonb NOT NULL DEFAULT '[]'::jsonb;