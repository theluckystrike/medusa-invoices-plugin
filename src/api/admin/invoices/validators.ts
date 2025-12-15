import { z } from "zod";

export const createInvoiceSchema = z.object({
  order_id: z.string(),
});
