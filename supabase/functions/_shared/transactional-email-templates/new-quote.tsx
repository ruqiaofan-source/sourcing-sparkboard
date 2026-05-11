import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Equilinq'
const PRIMARY_COLOR = '#6366F1'
const LOGO_URL = 'https://chmoabjmtbbqdrgigspm.supabase.co/storage/v1/object/public/email-assets/equilinq-logo.png'

interface NewQuoteProps {
  recipientName?: string
  requestTitle?: string
  totalCost?: number | string
  currency?: string
  moq?: number | string
  deliveryDays?: number | string
  quoteUrl?: string
}

const NewQuoteEmail = ({
  recipientName,
  requestTitle = 'your sourcing request',
  totalCost,
  currency = 'EUR',
  moq,
  deliveryDays,
  quoteUrl = 'https://equilinq.eu/sourcing-requests',
}: NewQuoteProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>A new quote is ready for {requestTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Equilinq" width="40" height="40" style={{ margin: '0 0 20px' }} />
        <Heading style={h1}>
          {recipientName ? `Hi ${recipientName},` : 'Hi there,'}
        </Heading>
        <Text style={text}>
          Good news — a new quote is ready for <strong>{requestTitle}</strong>. Review the full breakdown and accept it to move forward.
        </Text>
        {(totalCost || moq || deliveryDays) && (
          <Section style={summary}>
            {totalCost && (
              <Text style={summaryRow}><span style={summaryLabel}>Total cost</span><span style={summaryValue}>{currency} {totalCost}</span></Text>
            )}
            {moq && (
              <Text style={summaryRow}><span style={summaryLabel}>MOQ</span><span style={summaryValue}>{moq} units</span></Text>
            )}
            {deliveryDays && (
              <Text style={summaryRow}><span style={summaryLabel}>Delivery</span><span style={summaryValue}>~{deliveryDays} days</span></Text>
            )}
          </Section>
        )}
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={quoteUrl} style={button}>Review the quote</Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because you have an active sourcing request on {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewQuoteEmail,
  subject: (data: Record<string, any>) =>
    `New quote ready${data?.requestTitle ? ` for ${data.requestTitle}` : ''}`,
  displayName: 'New quote available',
  previewData: {
    recipientName: 'Jane',
    requestTitle: 'Custom packaging for skincare line',
    totalCost: '1,240.00',
    currency: 'EUR',
    moq: 500,
    deliveryDays: 21,
    quoteUrl: 'https://equilinq.eu/sourcing-requests',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 25px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const summary = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '14px 18px',
  margin: '18px 0',
}
const summaryRow = { fontSize: '13px', color: '#1f2937', margin: '4px 0', display: 'flex' as const, justifyContent: 'space-between' as const }
const summaryLabel = { color: '#6b7280', marginRight: '12px' }
const summaryValue = { color: '#111827', fontWeight: '600' as const }
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
