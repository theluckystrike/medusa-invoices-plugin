import { model } from "@medusajs/framework/utils";
import {
  //InvoiceCreatedByEvent,
  InvoiceStatus,
  InvoiceTemplateId,
} from "../../../constants/invoice";

const Invoice = model.define("invoice", {
  id: model.id({ prefix: "inv" }).primaryKey(),
  order_display_id: model.number(),
  status: model.enum(InvoiceStatus),
  completed_at: model.dateTime().nullable(),
  pdf_url: model.text().nullable(),
  template_id: model.enum(InvoiceTemplateId),
  template_version: model.text(),
  settings_snapshot: model.json(),
  error_message: model.text().nullable(),
  //created_by_event: model.enum(InvoiceCreatedByEvent),
});

export default Invoice;
