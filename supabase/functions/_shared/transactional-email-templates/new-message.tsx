import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Equilinq'
const PRIMARY_COLOR = '#6366F1'
const LOGO_URL = 'https://chmoabjmtbbqdrgigspm.supabase.co/storage/v1/object/public/email-assets/equilinq-logo.png'

interface NewMessageProps {
  recipientName?: string
  senderName?: string
  requestTitle?: string
  messagePreview?: string
  conversationUrl?: string
}

const NewMessageEmail = ({
  recipientName,
  senderName = 'Your sourcing agent',
  requestTitle = 'your sourcing request',
  messagePreview = '',
  conversationUrl = 'https://equilinq.eu/messages',
}: NewMessageProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{senderName} sent you a new message on {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Equilinq" width="40" height="40" style={{ margin: '0 0 20px' }} />
        <Heading style={h1}>
          {recipientName ? `Hi ${recipientName},` : 'Hi there,'}
        </Heading>
        <Text style={text}>
          <strong>{senderName}</strong> sent you a new message regarding <strong>{requestTitle}</strong>.
        </Text>
        {messagePreview && (
          <Section style={quote}>
            <Text style={quoteText}>{messagePreview}</Text>
          </Section>
        )}
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={conversationUrl} style={button}>
            View and reply
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because a sourcing agent replied to your request on {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewMessageEmail,
  subject: (data: Record<string, any>) =>
    `New message from ${data?.senderName || 'your sourcing agent'} on ${SITE_NAME}`,
  displayName: 'New chat message',
  previewData: {
    recipientName: 'Jane',
    senderName: 'Marco (Equilinq)',
    requestTitle: 'Custom packaging for skincare line',
    messagePreview: 'Hi Jane, I just received quotes from two factories. Would you like me to walk you through them?',
    conversationUrl: 'https://equilinq.eu/messages',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 25px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const quote = {
  borderLeft: `3px solid ${PRIMARY_COLOR}`,
  background: '#f5f5ff',
  padding: '14px 18px',
  margin: '20px 0',
  borderRadius: '4px',
}
const quoteText = { fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0, fontStyle: 'italic' as const }
const button = {
  backgroundColor: PRIMARY_COLOR,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0', lineHeight: '1.5' }
