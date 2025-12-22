import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../constants/invoice";

export type InvoiceSettingsDTO = {
  id: string;
  template_id: InvoiceTemplateId; // clean | classic | compact
  header_logo_type: InvoiceSettingsHeaderLogoType; // none | text | image
  header_logo_text: string | null;
  header_logo_url: string | null;
  header_content: string | null;
  footer_content: string | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[]; // order.completed | order.fulfillment.created | payment.captured
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type InvoiceSettingsRequestBody = {
  template_id: "clean" | "classic" | "compact";
  template_version: string;
  header_logo_type: "text" | "image" | "none";
  header_logo_text: string | null;
  header_logo_url: string | null;
  header_content: Record<string, any> | null;
  footer_content: Record<string, any> | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
};
