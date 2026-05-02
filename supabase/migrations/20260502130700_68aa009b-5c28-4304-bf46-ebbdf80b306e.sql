-- Add edited_at column to track edits
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS edited_at timestamp with time zone;

-- Allow senders to edit their own messages (content + edited_at only)
CREATE POLICY "Senders can update own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Allow senders to delete their own messages; admins can delete any
CREATE POLICY "Senders can delete own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger to prevent non-admin senders from changing immutable fields and
-- auto-stamp edited_at on content change
CREATE OR REPLACE FUNCTION public.protect_message_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.sourcing_request_id IS DISTINCT FROM OLD.sourcing_request_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot modify sender, request, or created_at on a message';
  END IF;

  IF NEW.content IS DISTINCT FROM OLD.content THEN
    NEW.edited_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_message_updates_trg ON public.messages;
CREATE TRIGGER protect_message_updates_trg
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.protect_message_updates();