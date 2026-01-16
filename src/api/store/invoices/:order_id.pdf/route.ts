import {
  AuthenticatedMedusaRequest,
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
      "Order display ID is required.",
    );
  }

  const display_id = Number(order_id);

  if (Number.isNaN(display_id)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order display ID must be a number.",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: { display_id },
  });

  const order = orders[0];

  if (!order) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order with display_id ${display_id} not found`,
    );
  }

  const { data: orderInvoices } = await query.graph({
    entity: OrderInvoiceLink.entryPoint,
    fields: ["invoice.pdf_url", "order.customer_id"],
    filters: { order_id: order.id },
    pagination: {
      take: 1,
      order: {
        created_at: "DESC",
      },
    },
  });

  const orderInvoiceLink = orderInvoices?.[0];

  if (!orderInvoiceLink) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invoice for order with display_id ${display_id} not found`,
    );
  }

  if (orderInvoiceLink.order.customer_id !== id) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You do not have access to this invoice",
    );
  }

  const invoiceURL = orderInvoiceLink.invoice?.pdf_url;

  if (!invoiceURL) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Invoice PDF URL is missing",
    );
  }

  const invoiceId = orderInvoiceLink.invoice.id;

  res.json({
    invoice_id: invoiceId,
    invoice_pdf_url: invoiceURL,
  });
}
