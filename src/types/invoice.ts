import {
  InvoiceCreatedByEvent,
  InvoiceSettingsHeaderLogoType,
  InvoiceStatus,
  InvoiceTemplateId,
} from "../constants/invoice";

export type InvoiceSettingsSnapshot = {
  template_id: InvoiceTemplateId; // clean | classic | compact
  template_version: string;
  header_logo: {
    type: InvoiceSettingsHeaderLogoType; // none | text | image
    text: string | null;
    url: string | null;
  };
  header_content: string | null;
  footer_content: string | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
};

export type InvoiceDTO = {
  id: string;
  order_display_id: number;
  status: InvoiceStatus; // queued | generating | completed | failed
  completed_at: Date | null;
  pdf_url: string | null;
  template_id: InvoiceTemplateId; // clean | classic | compact
  template_version: string;
  settings_snapshot: Record<string, any>;
  error_message: string | null;
  created_by_event: InvoiceCreatedByEvent; // order.completed | order.fulfillment_created | payment.captured | manual
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type GenerateInvoiceWorkflowInput = {
  order_id: string;
  template_id?: InvoiceTemplateId; // clean | classic | compact
  created_by_event?: InvoiceCreatedByEvent; // defaults to "manual"
};

export type InvoiceGeneratedPayload = {
  invoice_id: string;
  order_id: string;
  order_display_id: number;
  pdf_url: string;
  template_id: string;
  template_version: string;
  completed_at: string;
};

export type InvoiceFailedPayload = {
  order_id: string;
  error_message: string;
};

export type GetInvoiceResponse = {
  order_display_id: number;
  status: InvoiceStatus;
  completed_at: string | null;
  pdf_url: string | null;
  template_id: InvoiceTemplateId;
  template_version: string;
  error_message: string | null;
  created_by_event: InvoiceCreatedByEvent; // order.completed | order.fulfillment_created | payment.captured | manual
  created_at: Date | string;
};

export type GetInvoicesResponseInvoice = GetInvoiceResponse & { id: string };

export type GetInvoicesResponse = {
  invoices: GetInvoicesResponseInvoice[];
  count: number;
  offset: number;
  limit: number;
};

export type GenerateInvoiceRequestBody = {
  template_id?: InvoiceTemplateId; // clean | classic | compact
  created_by_event?: InvoiceCreatedByEvent; // defaults to "manual"
};
