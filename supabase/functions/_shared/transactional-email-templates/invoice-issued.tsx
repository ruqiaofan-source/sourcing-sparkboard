/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Equilinq"

interface InvoiceIssuedProps {
  customerName?: string
  invoiceNumber?: string
  totalAmount?: string
  currency?: string
  productName?: string
  invoiceUrl?: string
}

const InvoiceIssuedEmail = ({
  customerName,
  invoiceNumber = 'INV-XXXXXX',
  totalAmount = '0.00',
  currency = 'EUR',
  productName = 'Your product',
  invoiceUrl,
}: InvoiceIssuedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your invoice {invoiceNumber} from {SITE_NAME} is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Hi ${customerName},` : 'Hello,'}
        </Heading>
        <Text style={text}>
          Your invoice <strong style={{ color: '#1a1a1a' }}>{invoiceNumber}</strong> has been issued and is ready for review.
        </Text>

        <Section style={invoiceBox}>
          <Text style={invoiceLabel}>Product</Text>
          <Text style={invoiceValue}>{productName}</Text>
          <Hr style={divider} />
          <Text style={invoiceLabel}>Total Amount</Text>
          <Text style={totalStyle}>{currency} {totalAmount}</Text>
        </Section>

        {invoiceUrl && (
          <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
            <Button style={button} href={invoiceUrl}>
              View Invoice
            </Button>
          </Section>
        )}

        <Text style={text}>
          You can view the full breakdown, download, or print your invoice from your dashboard.
        </Text>

        <Text style={text}>
          Production will commence after payment has been received. If you have any questions, reply to this email or reach out via your dashboard.
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvoiceIssuedEmail,
  subject: (data: Record<string, any>) =>
    `Invoice ${data.invoiceNumber || ''} from Equilinq is ready`.trim(),
  displayName: 'Invoice issued',
  previewData: {
    customerName: 'Jane',
    invoiceNumber: 'INV-ABC123',
    totalAmount: '1,248.02',
    currency: 'EUR',
    productName: 'Custom LED Panels',
    invoiceUrl: 'https://dashboard.equilinq.eu/invoice/example-id',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Space Grotesk', 'Inter', Arial, sans-serif",
}
const container = { padding: '32px 28px', maxWidth: '520px' }
const h1 = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#1a1a1a',
  margin: '0 0 16px',
  fontFamily: "'Space Grotesk', Arial, sans-serif",
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const invoiceBox = {
  backgroundColor: '#f8f8fc',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '8px 0 24px',
  border: '1px solid #ededf0',
}
const invoiceLabel = {
  fontSize: '11px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: '#888',
  margin: '0 0 4px',
}
const invoiceValue = {
  fontSize: '15px',
  fontWeight: '600' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}
const divider = { borderColor: '#ededf0', margin: '12px 0' }
const totalStyle = {
  fontSize: '20px',
  fontWeight: '700' as const,
  color: '#6366F1',
  margin: '0',
}
const button = {
  backgroundColor: '#6366F1',
  color: '#ffffff',
  borderRadius: '999px',
  padding: '12px 32px',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
}
const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '32px 0 0',
  lineHeight: '1.5',
}
