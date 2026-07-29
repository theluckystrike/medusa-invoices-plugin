import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { InvoiceCreatedByEvent } from "../constants/invoice";
import generateInvoiceWorkflow from "../workflows/generate-invoice";

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
  orderCompletedPayload | orderFulfillmentCreatedPayload | paymentCapturedPayload
>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const { name, data } = event;
  let orderId: string | undefined;

  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info(`invoices: subscriber triggered for event ${name}`);

  if (name === InvoiceCreatedByEvent.ORDER_COMPLETED) {
    orderId = (data as orderCompletedPayload).id;
  } else if (name === InvoiceCreatedByEvent.FULFILLMENT_CREATED) {
    orderId = (data as orderFulfillmentCreatedPayload).order_id;
  } else if (name === InvoiceCreatedByEvent.PAYMENT_CAPTURED) {
    const { data: payments } = await query.graph({
      entity: "payment",
      fields: ["payment_collection.*"],
      filters: {
        id: (data as paymentCapturedPayload).id,
      },
    });

    if (!payments?.[0]?.payment_collection) {
      logger.info("invoices: no payment collection found for payment");
      return;
    }

    const paymentCollection = payments[0].payment_collection;

    const { data: paymentCollections } = await query.graph({
      entity: "payment_collection",
      fields: ["order.*"],
      filters: {
        id: paymentCollection.id,
      },
    });

    const pc = paymentCollections?.[0];

    if (!pc?.order) {
      logger.info(`invoices: no order found for payment collection`);
      return;
    }

    orderId = pc.order.id;
  } else {
    logger.debug(`invoices: unhandled event type ${name}`);
    return;
  }

  if (!orderId) {
    logger.error(`invoices: orderId not resolved for event ${name}`);
    return;
  }

  const storeModuleService = container.resolve(Modules.STORE);
  const stores = await storeModuleService.listStores();

  if (!stores?.[0]) {
    logger.error("invoices: no store found");
    return;
  }

  const store = stores[0];

  const { data: storeInvoiceSettingsList } = await query.graph({
    entity: "store",
    fields: ["invoice_settings.*"],
    filters: {
      id: store.id,
    },
  });

  if (!storeInvoiceSettingsList?.[0]?.invoice_settings) {
    logger.info(`invoices: no invoice settings found for store with id ${store.id}`);
    return;
  }

  const storeInvoiceSettings = storeInvoiceSettingsList[0].invoice_settings;
  const { auto_generate_on } = storeInvoiceSettings;

  logger.debug(`invoices: auto_generate_on triggers: ${auto_generate_on.join(",")}, event ${name}`);

  if (
    (auto_generate_on.includes(InvoiceCreatedByEvent.ORDER_COMPLETED) &&
      name === "order.completed") ||
    (auto_generate_on.includes(InvoiceCreatedByEvent.FULFILLMENT_CREATED) &&
      name === "order.fulfillment_created") ||
    (auto_generate_on.includes(InvoiceCreatedByEvent.PAYMENT_CAPTURED) &&
      name === "payment.captured")
  ) {
    await generateInvoiceWorkflow(container).run({
      input: { order_id: orderId, created_by_event: name },
    });

    logger.info(`invoices: workflow started for order ${orderId}`);
  }
}

export const config: SubscriberConfig = {
  event: ["order.completed", "order.fulfillment_created", "payment.captured"],
};
