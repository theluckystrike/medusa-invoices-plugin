import { model } from "@medusajs/framework/utils";

const InvoiceSettings = model.define("invoice_settings", {
  id: model.id({ prefix: "invset" }).primaryKey(),
  style: model.enum(["clean", "classic", "compact"]),
  header_type: model.enum(["heading", "image", "none"]),
  image_url: model.text().nullable(),
  header_text: model.text().nullable(),
  additional_header_content: model.json().nullable(),
  additional_footer_content: model.json().nullable(),
  business: model.json().default({
    name: "",
    address: "",
    tax_id: "",
    iban: "",
    swift: "",
  }),
  auto_order_completed: model.boolean().default(false),
  auto_payment_captured: model.boolean().default(false),
  auto_fullfillment_created: model.boolean().default(false),
});

export default InvoiceSettings;
