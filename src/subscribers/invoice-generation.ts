import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import {
  InvoiceFailedPayload,
  InvoiceGeneratedPayload,
} from "../types/invoice";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function orderInvoiceHandler({
  event,
  container,
}: SubscriberArgs<InvoiceGeneratedPayload | InvoiceFailedPayload>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const { name, data } = event;

  logger.info(`invoices: subscriber triggered for event ${name}`);
}

export const config: SubscriberConfig = {
  event: ["invoice.generated", "invoice.failed"],
};
