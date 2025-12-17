import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import OrderInvoiceLink from "../../../../links/order-invoice";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { order_id } = req.params;

  if (!order_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order ID is required.",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orderInvoices } = await query.graph({
    entity: OrderInvoiceLink.entryPoint,
    fields: ["invoice.*"],
    filters: { order_id },
    pagination: {
      take: 1,
      order: {
        created_at: "DESC",
      },
    },
  });

  console.log(orderInvoices);

  res.json(orderInvoices);

  // const order = orders[0];

  // if (!order) {
  //   throw new MedusaError(
  //     MedusaError.Types.NOT_FOUND,
  //     `Order with ID ${order_id} was not found.`,
  //   );
  // }

  // const activeInvoice = order.invoices?.find((inv) => inv.is_active) || null;

  // if (!activeInvoice) {
  //   throw new MedusaError(
  //     MedusaError.Types.NOT_FOUND,
  //     `Active invoice for order with ID ${order_id} was not found.`,
  //   );
  // }

  // res.json(activeInvoice);
}
