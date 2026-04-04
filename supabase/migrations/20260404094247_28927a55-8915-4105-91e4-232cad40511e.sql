
CREATE TABLE public.audit_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  suggestion text,
  status text NOT NULL DEFAULT 'open',
  resolved_at timestamptz,
  metadata jsonb
);

ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage audit findings"
ON public.audit_findings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role full access audit findings"
ON public.audit_findings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_audit_findings_status ON public.audit_findings(status);
CREATE INDEX idx_audit_findings_created ON public.audit_findings(created_at DESC);
