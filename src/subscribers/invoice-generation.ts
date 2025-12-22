import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import {
  InvoiceFailedPayload,
  InvoiceGeneratedPayload,
} from "../types/invoice";

export default async function orderInvoiceHandler({
  event,
  container,
}: SubscriberArgs<InvoiceGeneratedPayload | InvoiceFailedPayload>) {
  const { name, data } = event;

  console.log("Event name: ", name);
  console.log("Event data: ", data);
}

export const config: SubscriberConfig = {
  event: ["invoice.generated", "invoice.failed"],
};
