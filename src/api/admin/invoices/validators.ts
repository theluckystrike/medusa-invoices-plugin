import { z } from "zod";
import { InvoiceCreatedByEvent, InvoiceTemplateId } from "../../../constants/invoice";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

const invoiceTemplateIdSchema = z.nativeEnum(InvoiceTemplateId);
const InvoiceCreatedByEventSchema = z.nativeEnum(InvoiceCreatedByEvent);

export const generateInvoiceSchema = z.object({
  template_id: invoiceTemplateIdSchema.optional(),
  created_by_event: InvoiceCreatedByEventSchema.optional(),
});

export type GenerateInvoiceRequestBody = z.infer<typeof generateInvoiceSchema>;

export const adminGetInvoicesParams = createFindParams().extend({
  status: z.array(z.string()).optional(),
  created_by_event: z.array(z.string()).optional(),
  template_version: z.array(z.string()).optional(),
});
