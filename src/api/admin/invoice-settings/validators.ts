import { z } from "zod";

export const createInvoiceSettingsSchema = z.object({
  style: z.enum(["clean", "classic", "compact"]),
  header_type: z.enum(["heading", "image", "none"]),
  image_url: z.string().nullable().optional(),
  header_text: z.string().nullable().optional(),
  additional_header_content: z.record(z.any()).nullable().optional(),
  additional_footer_content: z.record(z.any()).nullable().optional(),
  business: z
    .object({
      name: z.string(),
      address: z.string(),
      tax_id: z.string(),
      iban: z.string(),
      swift: z.string(),
    })
    .optional(),
  auto_order_completed: z.boolean().optional(),
  auto_payment_captured: z.boolean().optional(),
  auto_fullfillment_created: z.boolean().optional(),
});
