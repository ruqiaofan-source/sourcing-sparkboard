DO $$
DECLARE
  ids uuid[] := ARRAY[
    '8fc247f0-b66a-49c2-b9e7-96f66b64d135',
    '02a37351-ca78-40f3-a2fa-7da2cb69b9ff',
    '6359b0f8-33de-4488-92bf-64511aec46f6',
    'ed685485-c4fa-458d-81d5-1617e58c7cf0',
    '19cd59bf-0b47-4b43-baf9-4a00553238df',
    '15115d58-f976-4859-9b67-26d9cf1865bb',
    '27e6ef07-7327-48b0-b041-431c7b75537e',
    'cbd68cd5-dd90-4948-bbf0-16751b99fe30'
  ]::uuid[];
BEGIN
  DELETE FROM public.invoices WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.orders WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.quotes WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.messages WHERE sourcing_request_id = ANY(ids);
  DELETE FROM public.sourcing_requests WHERE id = ANY(ids);
END $$;