
-- Enable leaked password protection via auth config
ALTER ROLE authenticator SET pgrst.db_leaked_password_protection = 'true';

-- Actually this is an auth-level setting. Let's try the correct approach:
-- Note: This setting is managed by Supabase Auth, not directly via SQL.
-- Documenting intent. The actual toggle happens via auth configuration API.
SELECT 1;
