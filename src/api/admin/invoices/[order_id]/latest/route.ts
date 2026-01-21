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

  const { data: orderInvoices } = await query.graph({
    entity: "invoice",
    fields: [
      "status",
      "completed_at",
      "pdf_url",
      "template_id",
      "template_version",
      "error_message",
      "order_display_id",
      "created_by_event",
    ],
    filters: { order_id },
    pagination: {
      take: 1,
      order: {
        created_at: "DESC",
      },
    },
  });

  const firstInvoice = orderInvoices?.[0];

  if (!firstInvoice) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invoice for order with id ${order_id} not found`,
    );
  }

  const { id, ...orderInvoiceResponse } = firstInvoice;

  res.json(orderInvoiceResponse);
}
