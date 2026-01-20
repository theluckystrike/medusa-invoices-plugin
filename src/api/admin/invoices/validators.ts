import { z } from "zod";
import {
  InvoiceCreatedByEvent,
  InvoiceTemplateId,
} from "../../../constants/invoice";

const invoiceTemplateIdSchema = z.nativeEnum(InvoiceTemplateId);
const InvoiceCreatedByEventSchema = z.nativeEnum(InvoiceCreatedByEvent);

export const generateInvoiceSchema = z.object({
  template_id: invoiceTemplateIdSchema.optional(),
  created_by_event: InvoiceCreatedByEventSchema,
});

export type GenerateInvoiceRequestBody = z.infer<typeof generateInvoiceSchema>;
