// import { JSONContent } from "@tiptap/react";
// import {
//   InvoiceSettingsAutoGenerateTrigger,
//   InvoiceSettingsHeaderLogoType,
//   InvoiceTemplateId,
// } from "../constants/invoice";
// import { OrderDTO } from "@medusajs/framework/types";
// import { InvoiceSettingsSnapshot } from "./invoice";

// export type TemplateSettings = {
//   template_id: InvoiceTemplateId;
//   header_logo_type: InvoiceSettingsHeaderLogoType;
//   header_logo_url: string;
//   header_logo_text: string;
//   header_content: JSONContent;
//   footer_content: JSONContent;
//   store_name: string;
//   store_address: string;
//   store_tax_id: string;
//   bank_account_iban: string;
//   bank_account_swift: string;
//   auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
// };

// export type TemplateSettingsForTemplate = Omit<
//   InvoiceSettingsSnapshot,
//   "header_content" | "footer_content"
// > & {
//   header_content: JSONContent | null;
//   footer_content: JSONContent | null;
// };

// export type TemplateProps = {
//   order: Pick<
//     OrderDTO,
//     // TODO: reorder these based on OrderDTO definition
//     | "id"
//     | "display_id"
//     | "billing_address"
//     | "shipping_address"
//     | "tax_total"
//     | "total"
//     | "created_at"
//     | "items"
//     | "subtotal"
//     | "discount_total"
//     | "shipping_total"
//     | "currency_code"
//   >;
//   settings: TemplateSettingsForTemplate;
//   invoice: {
//     id: string;
//     created_at: Date;
//     display_number: number;
//   };
// };

// export type TemplateRenderer = (
//   props: TemplateProps,
// ) => Promise<React.ReactElement>;

// export type InvoiceTemplate = {
//   id: InvoiceTemplateId;
//   version: string;
//   render: TemplateRenderer;
// };
