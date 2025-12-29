import { JSONContent } from "@tiptap/react";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../constants/invoice";
import { OrderDTO } from "@medusajs/framework/types";
import { InvoiceSettingsSnapshot } from "./invoice";

export type TemplateSettings = {
  template_id: InvoiceTemplateId;
  header_logo_type: InvoiceSettingsHeaderLogoType;
  header_logo_url: string;
  header_logo_text: string;
  header_content: JSONContent;
  footer_content: JSONContent;
  store_name: string;
  store_address: string;
  store_tax_id: string;
  bank_account_iban: string;
  bank_account_swift: string;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
};

export type TemplateSettingsForTemplate = Omit<
  InvoiceSettingsSnapshot,
  "header_content" | "footer_content"
> & {
  header_content: JSONContent | null;
  footer_content: JSONContent | null;
};

export type TemplateProps = {
  order: OrderDTO;
  settings: TemplateSettingsForTemplate;
  invoice: {
    id: string;
    created_at: Date;
    display_number: number;
  };
  currency_code: string;
  _styles: Record<string, any>;
};

export type TemplateRenderer = (
  props: Omit<TemplateProps, "_styles">,
) => Promise<React.ReactElement>;

export type InvoiceTemplate = {
  id: InvoiceTemplateId;
  version: string;
  render: TemplateRenderer;
};
