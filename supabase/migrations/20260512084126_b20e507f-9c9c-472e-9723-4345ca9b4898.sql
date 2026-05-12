
-- 1. Tighten customer invoice update policy: only unpaid -> paid
DROP POLICY IF EXISTS "Customers can update own invoices payment_status" ON public.invoices;
CREATE POLICY "Customers can mark own invoice as paid"
ON public.invoices
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND NOT (public.has_role(auth.uid(), 'agent'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  AND payment_status = 'unpaid'
)
WITH CHECK (
  auth.uid() = user_id
  AND payment_status = 'paid'
);

-- 2. Realtime channel authorization for invoices
-- Topic convention used by client: "invoices:<invoice_id>" or generic "invoices".
-- Restrict subscription to the owner of the referenced invoice, or agents/admins.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'realtime' AND tablename = 'messages') THEN
    EXECUTE $p$
      DROP POLICY IF EXISTS "Invoice channel restricted to owner or staff" ON realtime.messages;
      CREATE POLICY "Invoice channel restricted to owner or staff"
      ON realtime.messages
      FOR SELECT
      TO authenticated
      USING (
        -- Only apply this policy to invoice topics; other topics handled by other policies.
        CASE
          WHEN realtime.topic() LIKE 'invoices:%' THEN
            public.has_role(auth.uid(), 'agent'::app_role)
            OR public.has_role(auth.uid(), 'admin'::app_role)
            OR EXISTS (
              SELECT 1 FROM public.invoices i
              WHERE i.id::text = split_part(realtime.topic(), ':', 2)
                AND i.user_id = auth.uid()
            )
          WHEN realtime.topic() = 'invoices' THEN
            public.has_role(auth.uid(), 'agent'::app_role)
            OR public.has_role(auth.uid(), 'admin'::app_role)
          ELSE false
        END
      );
    $p$;
  END IF;
END $$;
