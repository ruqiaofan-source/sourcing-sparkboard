import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Equilinq'
const LOGO_URL = 'https://chmoabjmtbbqdrgigspm.supabase.co/storage/v1/object/public/email-assets/equilinq-logo.png'

interface AdminNotificationProps {
  eventType?: string
  title?: string
  summary?: string
  details?: Record<string, string | number | null | undefined>
  link?: string
}

const AdminNotificationEmail = ({ eventType, title, summary, details, link }: AdminNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{title || 'New activity on Equilinq'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Equilinq" width="40" height="40" style={{ margin: '0 0 20px' }} />
        {eventType && <Text style={tag}>{eventType.toUpperCase()}</Text>}
        <Heading style={h1}>{title || 'New activity'}</Heading>
        {summary && <Text style={text}>{summary}</Text>}
        {details && Object.keys(details).length > 0 && (
          <Section style={detailsBox}>
            {Object.entries(details).map(([k, v]) => (
              <React.Fragment key={k}>
                <Text style={label}>{k}</Text>
                <Text style={value}>{v == null || v === '' ? '-' : String(v)}</Text>
              </React.Fragment>
            ))}
          </Section>
        )}
        {link && <Text style={text}>Open in dashboard: <a href={link} style={linkStyle}>{link}</a></Text>}
        <Hr style={hr} />
        <Text style={footer}>This email was sent automatically by the {SITE_NAME} platform.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminNotificationEmail,
  subject: (data: Record<string, any>) => data.title ? `[Equilinq] ${data.title}` : '[Equilinq] New platform activity',
  displayName: 'Admin notification (internal)',
  to: 'admin@equilinq.eu',
  previewData: {
    eventType: 'new_signup',
    title: 'New customer registered',
    summary: 'A new customer just signed up on Equilinq.',
    details: { Name: 'Jane Doe', Email: 'jane@example.com', Phone: '+31 6 12345678' },
    link: 'https://equilinq.eu/admin',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 25px' }
const tag = { fontSize: '11px', color: '#3b82f6', fontWeight: '700' as const, letterSpacing: '1px', margin: '0 0 8px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px', margin: '8px 0 16px' }
const label = { fontSize: '12px', color: '#999999', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const value = { fontSize: '14px', color: '#111827', margin: '0 0 16px', lineHeight: '1.5' }
const linkStyle = { color: '#3b82f6', textDecoration: 'underline' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
