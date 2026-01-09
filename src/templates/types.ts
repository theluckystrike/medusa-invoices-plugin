import { BigNumberValue, OrderDTO } from "@medusajs/framework/types";
import { JSONContent } from "@tiptap/react";

export type TemplateOrderPropAddress = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_1?: string;
  city?: string;
};

export type TemplateOrderPropItem = {
  id: string;
  title: string;
  variant_sku?: string | null;
  quantity: number;
  unit_price: number;
  total: BigNumberValue;
};

export type TemplateOrderProp = {
  id: string;
  display_id: number;
  currency_code: string;
  shipping_address?: TemplateOrderPropAddress;
  billing_address?: TemplateOrderPropAddress;
  items?: TemplateOrderPropItem[];
  created_at: string | Date;
  total: BigNumberValue;
  subtotal: BigNumberValue;
  tax_total: BigNumberValue;
  discount_total: BigNumberValue;
  shipping_total: BigNumberValue;
};

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
  // order: Pick<
  //   OrderDTO,
  //   // TODO: reorder these based on OrderDTO definition
  //   | "id"
  //   | "display_id"
  //   | "currency_code"
  //   | "shipping_address"
  //   | "billing_address"
  //   | "items"
  //   | "created_at"
  //   | "total"
  //   | "subtotal"
  //   | "tax_total"
  //   | "discount_total"
  //   | "shipping_total"
  // >;
  order: TemplateOrderProp;
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
