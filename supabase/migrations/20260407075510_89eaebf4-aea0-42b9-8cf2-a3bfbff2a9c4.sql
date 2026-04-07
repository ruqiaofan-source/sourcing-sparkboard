
CREATE TABLE public.trustpilot_stats (
  id integer PRIMARY KEY DEFAULT 1,
  review_count integer NOT NULL DEFAULT 0,
  average_rating numeric(2,1) NOT NULL DEFAULT 0.0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed with current known values
INSERT INTO public.trustpilot_stats (id, review_count, average_rating)
VALUES (1, 5, 4.0);

-- Public read access (no auth needed for landing page)
ALTER TABLE public.trustpilot_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read trustpilot stats"
  ON public.trustpilot_stats FOR SELECT
  USING (true);
