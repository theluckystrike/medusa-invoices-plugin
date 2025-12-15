import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type orderCompletedPayload = {
  id: string; //ID of order
};

type orderFulfillmentCreatedPayload = {
  order_id: string;
  fulfillment_id: string;
  no_notification: boolean;
};

type paymentCapturedPayload = {
  id: string; //ID of payment
};

export default async function orderInvoiceHandler({
  event,
  container,
}: SubscriberArgs<
  | orderCompletedPayload
  | orderFulfillmentCreatedPayload
  | paymentCapturedPayload
>) {
  const { name, data } = event;
  let orderId: string;

  if (name === "order.completed") {
    orderId = (data as orderCompletedPayload).id;
  } else if (name === "order.fulfillment_created") {
    orderId = (data as orderFulfillmentCreatedPayload).order_id;
  } else if (name === "order.placed") {
    orderId = (data as orderCompletedPayload).id;
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["*", "invoice_settings.*"],
    filters: {
      id: orderId!,
    },
    pagination: {
      take: 1,
    },
  });

  const invoiceSettings = orders[0].invoice_settings;

  console.log(invoiceSettings);
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.completed",
    "order.fulfillment_created",
    "payment.captured",
  ],
};
