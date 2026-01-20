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
    fields: [
      "invoice.status",
      "invoice.completed_at",
      "invoice.pdf_url",
      "invoice.template_id",
      "invoice.template_version",
      "invoice.error_message",
      "invoice.order_display_id",
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

  const firstInvoiceLink = orderInvoices?.[0];

  if (!firstInvoiceLink?.invoice) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invoice for order with id ${order_id} not found`,
    );
  }

  const { id, ...orderInvoiceResponse } = firstInvoiceLink.invoice;

  res.json(orderInvoiceResponse);
}
