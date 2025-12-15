import { model } from "@medusajs/framework/utils";

const Invoice = model.define("invoice", {
  id: model.id({ prefix: "inv" }).primaryKey(),
  is_active: model.boolean().default(true),
  number: model.text().unique(),
  pdf_url: model.text().nullable(),
});

export default Invoice;
