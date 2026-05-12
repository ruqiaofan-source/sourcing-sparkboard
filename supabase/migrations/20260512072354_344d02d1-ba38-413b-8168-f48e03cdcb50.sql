ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;