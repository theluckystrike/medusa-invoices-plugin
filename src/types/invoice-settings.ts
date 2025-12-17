import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../constants/invoice";

export type InvoiceSettingsResponse = {
  id: string;
  template_id: InvoiceTemplateId;
  template_version: string;
  header_logo_type: InvoiceSettingsHeaderLogoType;
  header_logo_url: string | null;
  header_logo_text: string | null;
  header_content: Record<string, any> | null;
  footer_content: Record<string, any> | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type InvoiceSettingsRequestBody = {
  template_id: "clean" | "classic" | "compact";
  header_logo_type: "heading" | "image" | "none";
  header_logo_url: string | null;
  header_logo_text?: string | null;
  header_content: Record<string, any> | null;
  footer_content: Record<string, any> | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
  auto_order_completed: boolean;
  auto_payment_captured: boolean;
  auto_fullfillment_created: boolean;
};
