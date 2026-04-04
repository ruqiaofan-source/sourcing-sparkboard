/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from 'npm:@react-email/components@0.0.22'

interface AuditAlertProps {
  findings: Array<{
    title: string
    severity: string
    category: string
    description: string
    suggestion?: string
  }>
  summary?: string
  date?: string
}

const AuditAlertEmail = ({
  findings = [],
  summary = '',
  date = new Date().toISOString().split('T')[0],
}: AuditAlertProps) => {
  const highFindings = findings.filter(
    (f) => f.severity === 'high' || f.severity === 'critical'
  )

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Equilinq Audit Alert</Text>
          <Text style={subheading}>
            {highFindings.length} critical finding{highFindings.length !== 1 ? 's' : ''} detected on {date}
          </Text>

          {summary && (
            <Section style={summaryBox}>
              <Text style={summaryLabel}>AI Summary</Text>
              <Text style={summaryText}>{summary}</Text>
            </Section>
          )}

          <Hr style={hr} />

          {highFindings.map((f, i) => (
            <Section key={i} style={findingCard}>
              <Text style={findingSeverity}>
                {f.severity.toUpperCase()} / {f.category}
              </Text>
              <Text style={findingTitle}>{f.title}</Text>
              <Text style={findingDesc}>{f.description}</Text>
              {f.suggestion && (
                <Text style={findingSuggestion}>Suggestion: {f.suggestion}</Text>
              )}
            </Section>
          ))}

          <Hr style={hr} />
          <Text style={footer}>
            Review all findings in your{' '}
            <Link href="https://sourcing-sparkboard.lovable.app/admin/audit" style={link}>
              admin dashboard
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#f4f4f7',
  fontFamily: "'Inter', Arial, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '32px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
}

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 4px',
}

const subheading: React.CSSProperties = {
  fontSize: '15px',
  color: '#dc2626',
  fontWeight: 600,
  margin: '0 0 20px',
}

const summaryBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '16px',
}

const summaryLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  color: '#64748b',
  margin: '0 0 6px',
  letterSpacing: '0.5px',
}

const summaryText: React.CSSProperties = {
  fontSize: '14px',
  color: '#334155',
  lineHeight: '1.6',
  margin: 0,
}

const hr: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
}

const findingCard: React.CSSProperties = {
  borderLeft: '3px solid #dc2626',
  paddingLeft: '14px',
  marginBottom: '18px',
}

const findingSeverity: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#dc2626',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
}

const findingTitle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#0f172a',
  margin: '0 0 4px',
}

const findingDesc: React.CSSProperties = {
  fontSize: '13px',
  color: '#475569',
  lineHeight: '1.5',
  margin: '0 0 4px',
}

const findingSuggestion: React.CSSProperties = {
  fontSize: '13px',
  color: '#6366f1',
  fontStyle: 'italic',
  margin: 0,
}

const footer: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  textAlign: 'center' as const,
}

const link: React.CSSProperties = {
  color: '#6366f1',
}

export const template = {
  component: AuditAlertEmail,
  subject: (data: Record<string, any>) =>
    `[Equilinq] ${data.findings?.filter((f: any) => f.severity === 'high' || f.severity === 'critical').length || 0} critical audit finding(s) - ${data.date || 'today'}`,
  displayName: 'Audit Alert',
  previewData: {
    date: '2026-04-04',
    summary: 'Two high-severity findings detected: unpaid invoices over 30 days and a large table exceeding performance thresholds.',
    findings: [
      {
        title: '5 invoices unpaid for 30+ days',
        severity: 'high',
        category: 'operations',
        description: 'Outstanding invoices older than 30 days may indicate payment issues.',
        suggestion: 'Send payment reminders or escalate to the relevant agent.',
      },
    ],
  },
}
