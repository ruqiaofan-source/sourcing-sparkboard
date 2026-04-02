/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Equilinq"
const LOGO_URL = 'https://chmoabjmtbbqdrgigspm.supabase.co/storage/v1/object/public/email-assets/equilinq-logo.png'

interface InvoiceIssuedProps {
  customerName?: string
  invoiceNumber?: string
  totalAmount?: string
  currency?: string
  productName?: string
  invoiceUrl?: string
}

const bankAccounts = [
  {
    title: 'EUR - Europe (Germany)',
    fields: [
      { label: 'Account Name', value: 'Equilinq Limited' },
      { label: 'IBAN', value: 'DE49202208000047365649' },
      { label: 'SWIFT', value: 'SXPYDEHH' },
    ],
  },
  {
    title: 'USD - United States',
    fields: [
      { label: 'Account Name', value: 'Equilinq Limited' },
      { label: 'Account Number', value: '8484328871' },
      { label: 'ACH Routing', value: '026073150' },
      { label: 'SWIFT', value: 'CMFGUS33' },
    ],
  },
  {
    title: 'HKD - Hong Kong',
    fields: [
      { label: 'Account Name', value: 'Equilinq Limited' },
      { label: 'Account Number', value: '7949875204' },
      { label: 'Bank/Branch', value: '016 / 478' },
      { label: 'SWIFT', value: 'DHBKHKHH' },
    ],
  },
]

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
    <Preview>Your invoice {invoiceNumber} from {SITE_NAME} is ready - payment instructions inside</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Hi ${customerName},` : 'Hello,'}
        </Heading>
        <Text style={text}>
          Your invoice <strong style={{ color: '#1a1a1a' }}>{invoiceNumber}</strong> has been issued and is ready for payment.
        </Text>

        <Section style={invoiceBox}>
          <Text style={invoiceLabel}>Product</Text>
          <Text style={invoiceValue}>{productName}</Text>
          <Hr style={divider} />
          <Text style={invoiceLabel}>Total Amount Due</Text>
          <Text style={totalStyle}>{currency} {totalAmount}</Text>
        </Section>

        {invoiceUrl && (
          <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
            <Button style={button} href={invoiceUrl}>
              View Invoice & Pay
            </Button>
          </Section>
        )}

        <Hr style={{ borderColor: '#ededf0', margin: '24px 0' }} />

        <Heading style={h2}>Payment Instructions</Heading>
        <Text style={text}>
          Please transfer the total amount to one of the following bank accounts. Use your invoice number <strong style={{ color: '#1a1a1a' }}>{invoiceNumber}</strong> as the payment reference.
        </Text>

        {bankAccounts.map((account) => (
          <Section key={account.title} style={bankBox}>
            <Text style={bankTitle}>{account.title}</Text>
            {account.fields.map((field) => (
              <Row key={field.label} style={{ margin: '0' }}>
                <Column style={bankLabel}>{field.label}</Column>
                <Column style={bankValue}>{field.value}</Column>
              </Row>
            ))}
          </Section>
        ))}

        <Section style={noteBox}>
          <Text style={noteText}>
            International transfers typically take 1-3 business days. Production will commence after payment confirmation.
          </Text>
        </Section>

        <Text style={text}>
          If you have any questions, reply to this email or reach out via your dashboard.
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
    `Invoice ${data.invoiceNumber || ''} from Equilinq - Payment Instructions`.trim(),
  displayName: 'Invoice issued with payment instructions',
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
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#1a1a1a',
  margin: '0 0 16px',
  fontFamily: "'Space Grotesk', Arial, sans-serif",
}
const h2 = {
  fontSize: '17px',
  fontWeight: '700' as const,
  color: '#1a1a1a',
  margin: '0 0 12px',
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
const bankBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '14px 18px',
  margin: '0 0 10px',
  border: '1px solid #ededf0',
}
const bankTitle = {
  fontSize: '13px',
  fontWeight: '700' as const,
  color: '#1a1a1a',
  margin: '0 0 8px',
}
const bankLabel = {
  fontSize: '11px',
  color: '#888',
  width: '120px',
  paddingBottom: '4px',
  verticalAlign: 'top' as const,
}
const bankValue = {
  fontSize: '13px',
  fontWeight: '600' as const,
  color: '#1a1a1a',
  paddingBottom: '4px',
  fontFamily: "'SF Mono', 'Menlo', monospace",
}
const noteBox = {
  backgroundColor: '#fffbeb',
  borderRadius: '8px',
  padding: '14px 18px',
  margin: '16px 0 24px',
  border: '1px solid #fde68a',
}
const noteText = {
  fontSize: '13px',
  color: '#92400e',
  lineHeight: '1.5',
  margin: '0',
}
const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '32px 0 0',
  lineHeight: '1.5',
}
