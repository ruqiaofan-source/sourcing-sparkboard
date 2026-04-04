-- Allow service_role to delete old read notifications
CREATE POLICY "Service role can delete notifications"
ON public.notifications
FOR DELETE
TO service_role
USING (true);

-- Allow service_role to delete old audit findings
CREATE POLICY "Service role can delete audit findings"
ON public.audit_findings
FOR DELETE
TO service_role
USING (true);

-- Allow service_role to delete old email send logs
CREATE POLICY "Service role can delete email send logs"
ON public.email_send_log
FOR DELETE
TO service_role
USING (true);