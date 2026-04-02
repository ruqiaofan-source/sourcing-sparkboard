-- Enable RLS on realtime.messages
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read realtime messages only on topics
-- that match their user ID or are shared channels they participate in
CREATE POLICY "Authenticated users can read own realtime messages"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    -- Allow if the topic contains the user's ID (e.g. user-specific channels)
    EXISTS (
      SELECT 1 WHERE realtime.topic() ~ ('^realtime:public:notifications:' || auth.uid()::text)
    )
    OR
    -- Allow general postgres_changes subscriptions (RLS on source tables already filters rows)
    EXISTS (
      SELECT 1 WHERE realtime.topic() ~ '^realtime:public:(sourcing_requests|quotes|messages)$'
    )
  );

-- Allow service role full access
CREATE POLICY "Service role has full access to realtime messages"
  ON realtime.messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);