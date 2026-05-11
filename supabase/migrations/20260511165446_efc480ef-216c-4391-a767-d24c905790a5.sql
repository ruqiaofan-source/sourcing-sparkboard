DO $$
DECLARE ids uuid[] := ARRAY['2fa23c29-ffd4-44b8-8dd1-09adaa859038'::uuid,'6c600bfa-c78b-4d88-afef-dfb21c7b2644'::uuid];
BEGIN
  DELETE FROM public.message_reads WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.messages WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.invoices WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.orders WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.quotes WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.notifications WHERE link LIKE '%2fa23c29-ffd4-44b8-8dd1-09adaa859038%' OR link LIKE '%6c600bfa-c78b-4d88-afef-dfb21c7b2644%';
  DELETE FROM public.sourcing_requests WHERE id = ANY(ids);
END $$;