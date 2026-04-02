import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Equilinq'
const LOGO_URL = 'https://chmoabjmtbbqdrgigspm.supabase.co/storage/v1/object/public/email-assets/equilinq-logo.png'

interface ContactNotificationProps {
  name?: string
  email?: string
  reason?: string
  message?: string
}

const ContactNotificationEmail = ({ name, email, reason, message }: ContactNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact form submission</Heading>
        <Section style={detailsBox}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || '-'}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || '-'}</Text>
          <Text style={label}>Reason</Text>
          <Text style={value}>{reason || '-'}</Text>
          <Text style={label}>Message</Text>
          <Text style={value}>{message || '-'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent automatically by the {SITE_NAME} contact form.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) => `New contact: ${data.name || 'Unknown'}`,
  displayName: 'Contact notification (internal)',
  to: 'contact@equilinq.eu',
  previewData: { name: 'Jane Doe', email: 'jane@company.com', reason: 'Sourcing consultation', message: 'I would like to source custom packaging from China.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 25px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#000000', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px', margin: '0 0 16px' }
const label = { fontSize: '12px', color: '#999999', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const value = { fontSize: '14px', color: '#111827', margin: '0 0 16px', lineHeight: '1.5' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
