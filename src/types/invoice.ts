import {
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
  settings_snapshot: InvoiceSettingsSnapshot;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type GenerateInvoiceWorkflowInput = {
  order_id: string;
  opts?: {
    template_id?: InvoiceTemplateId; // clean | classic | compact
  };
};
