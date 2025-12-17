import { InvoiceStatus, InvoiceTemplateId } from "../constants/invoice";

export type InvoiceDTO = {
  id: string;
  status: InvoiceStatus;
  completed_at: string | null;
  pdf_url: string | null;
  template_id: InvoiceTemplateId;
  template_version: string;
  settings_snapshot: JSON;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type GenerateInvoiceWorkflowInput = {
  order_id: string;
  opts?: {
    template_id?: InvoiceTemplateId;
  };
};
