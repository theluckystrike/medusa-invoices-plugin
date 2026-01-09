import { AdminOrder, OrderDTO } from "@medusajs/framework/types";
import { JSONContent } from "@tiptap/react";

export type TemplateOrderDTO = Pick<
  OrderDTO,
  // TODO: reorder these based on OrderDTO definition
  | "id"
  | "display_id"
  | "currency_code"
  | "shipping_address"
  | "billing_address"
  | "items"
  | "created_at"
  | "total"
  | "subtotal"
  | "tax_total"
  | "discount_total"
  | "shipping_total"
>;

export type TemplateAdminOrder = Pick<
  AdminOrder,
  // TODO: reorder these based on AdminOrder definition
  | "id"
  | "display_id"
  | "currency_code"
  | "shipping_address"
  | "billing_address"
  | "items"
  | "created_at"
  | "total"
  | "subtotal"
  | "tax_total"
  | "discount_total"
  | "shipping_total"
>;

export type TemplateSettings = {
  template_id: "clean" | "classic" | "compact";
  header_logo_type: "none" | "text" | "image";
  header_logo_url: string;
  header_logo_text: string;
  header_content: JSONContent;
  footer_content: JSONContent;
  store_name: string;
  store_address: string;
  store_tax_id: string;
  bank_account_iban: string;
  bank_account_swift: string;
  auto_generate_on:
    | "order.completed"
    | "order.fulfillment_created"
    | "payment.captured"[];
};

export type TemplateSettingsForTemplate = {
  template_id: "clean" | "classic" | "compact";
  template_version: string;
  header_logo: {
    type: "none" | "text" | "image";
    text: string | null;
    url: string | null;
  };
  header_content: JSONContent | null;
  footer_content: JSONContent | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
};

export type TemplateProps = {
  order: TemplateOrderDTO | TemplateAdminOrder;
  settings: TemplateSettingsForTemplate;
  invoice: {
    id: string;
    created_at: Date;
    display_number: number;
  };
};

export type TemplateRenderer = (
  props: TemplateProps,
) => Promise<React.ReactElement>;

export type InvoiceTemplate = {
  id: "clean" | "classic" | "compact";
  version: string;
  render: TemplateRenderer;
};
