import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { order_id } = req.params;

  if (!order_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order ID is required.",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["*", "invoices.*"],
    filters: { id: order_id },
    pagination: { take: 1 },
  });

  const order = orders[0];

  if (!order) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order with ID ${order_id} was not found.`,
    );
  }

  const activeInvoice = order.invoices?.find((inv) => inv.is_active) || null;

  if (!activeInvoice) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Active invoice for order with ID ${order_id} was not found.`,
    );
  }

  res.json(activeInvoice);
}
