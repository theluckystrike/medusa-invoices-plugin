import { model } from "@medusajs/framework/utils";
import {
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../constants/invoice";

const InvoiceSettings = model.define("invoice_settings", {
  id: model.id({ prefix: "invset" }).primaryKey(),
  template_id: model.enum(InvoiceTemplateId),
  template_version: model.text(),
  header_logo_type: model.enum(InvoiceSettingsHeaderLogoType),
  header_logo_url: model.text().nullable(),
  header_logo_text: model.text().nullable(),
  header_content: model.json().nullable(),
  footer_content: model.json().nullable(),
  store_name: model.text().nullable(),
  store_address: model.text().nullable(),
  store_tax_id: model.text().nullable(),
  bank_account_iban: model.text().nullable(),
  bank_account_swift: model.text().nullable(),
  auto_generate_on: model.array().default([]),
});

export default InvoiceSettings;
