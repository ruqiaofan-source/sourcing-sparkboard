/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as invoiceIssued } from './invoice-issued.tsx'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as contactNotification } from './contact-notification.tsx'
import { template as auditAlert } from './audit-alert.tsx'
import { template as adminNotification } from './admin-notification.tsx'
import { template as newMessage } from './new-message.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'invoice-issued': invoiceIssued,
  'contact-confirmation': contactConfirmation,
  'contact-notification': contactNotification,
  'audit-alert': auditAlert,
  'admin-notification': adminNotification,
  'new-message': newMessage,
}
