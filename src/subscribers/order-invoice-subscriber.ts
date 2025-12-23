import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import createInvoiceWorkflow from "../workflows/generate-invoice";
import { InvoiceSettingsAutoGenerateTrigger } from "../constants/invoice";

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
  let orderId: string | undefined;

  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  if (name === "order.completed") {
    orderId = (data as orderCompletedPayload).id;
  } else if (name === "order.fulfillment_created") {
    orderId = (data as orderFulfillmentCreatedPayload).order_id;
  } else if (name === "payment.captured") {
    const { data: payments } = await query.graph({
      entity: "payment",
      fields: ["payment_collection.*"],
      filters: {
        id: (data as paymentCapturedPayload).id,
      },
    });

    if (!payments?.[0]?.payment_collection) {
      console.log("No payment collection found for payment:", data);
      return;
    }

    const paymentCollection = payments[0].payment_collection;

    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["*"],
      filters: {
        payment_collection: paymentCollection.id,
      },
    });

    if (!orders?.[0]) {
      console.log(
        "No order found for payment collection:",
        paymentCollection.id,
      );
      return;
    }

    orderId = orders[0].id;
  } else {
    console.log("Unhandled event type:", name);
    return;
  }

  if (!orderId) {
    console.log("No orderId found for event:", name);
    return;
  }

  const storeModuleService = container.resolve(Modules.STORE);
  const stores = await storeModuleService.listStores();

  if (!stores?.[0]) {
    console.log("No store found");
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
    console.log("No invoice settings found for store");
    return;
  }

  const storeInvoiceSettings = storeInvoiceSettingsList[0].invoice_settings;
  const { auto_generate_on } = storeInvoiceSettings;

  console.log("storeInvoiceSettings.auto_order_completed: ", auto_generate_on);

  if (
    (auto_generate_on.includes(
      InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED,
    ) &&
      name === "order.completed") ||
    (auto_generate_on.includes(
      InvoiceSettingsAutoGenerateTrigger.FULFILLMENT_CREATED,
    ) &&
      name === "order.fulfillment_created") ||
    (auto_generate_on.includes(
      InvoiceSettingsAutoGenerateTrigger.PAYMENT_CAPTURED,
    ) &&
      name === "payment.captured")
  ) {
    await createInvoiceWorkflow(container).run({
      input: { order_id: orderId },
    });
  }
}

export const config: SubscriberConfig = {
  event: ["order.completed", "order.fulfillment_created", "payment.captured"],
};
