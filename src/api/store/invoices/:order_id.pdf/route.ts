import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import OrderInvoiceLink from "../../../../links/order-invoice";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { order_id } = req.params;
  const id = req.auth_context?.actor_id;

  if (!order_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order ID is required.",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orderInvoices } = await query.graph({
    entity: OrderInvoiceLink.entryPoint,
    fields: ["invoice.pdf_url", "order.customer_id"],
    filters: { order_id },
    pagination: {
      take: 1,
      order: {
        created_at: "DESC",
      },
    },
  });

  const firstInvoiceLink = orderInvoices?.[0];

  if (firstInvoiceLink.order.customer_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You do not have access to this invoice",
    );
  }

  if (!firstInvoiceLink?.invoice) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invoice for order with id ${order_id} not found`,
    );
  }

  const invoicePdfUrl = firstInvoiceLink.invoice.pdf_url;

  if (!invoicePdfUrl) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Invoice PDF URL is missing",
    );
  }

  res.redirect(invoicePdfUrl);
}
