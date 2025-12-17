import { z } from "zod";
import { InvoiceTemplateId } from "../../../constants/invoice";

const invoiceTemplateIdSchema = z.nativeEnum(InvoiceTemplateId);

export const generateInvoiceSchema = z.object({
  opts: z
    .object({
      template_id: invoiceTemplateIdSchema.optional(),
    })
    .optional(),
});

export type GenerateInvoiceRequestBody = z.infer<typeof generateInvoiceSchema>;
