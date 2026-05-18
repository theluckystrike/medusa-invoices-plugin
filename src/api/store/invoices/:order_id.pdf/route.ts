import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import OrderInvoiceLink from "../../../../links/order-invoice";
import { InvoiceStatus } from "../../../../constants/invoice";
import { InvoiceDTO } from "../../../../types/invoice";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { order_id } = req.params;
  const id = req.auth_context?.actor_id;

  if (!order_id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Order ID is required.");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "customer_id"],
    filters: { id: order_id },
  });

  const order = orders[0];

  if (!order) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `Order with id ${order_id} not found`);
  }

  const { data: orderInvoices } = await query.graph({
    entity: OrderInvoiceLink.entryPoint,
    fields: ["invoice.id", "invoice.pdf_url", "invoice.status", "order.customer_id"],
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
      `Invoice for order with id ${order_id} not found`,
    );
  }

  if (orderInvoiceLink.order.customer_id !== id) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "You do not have access to this invoice");
  }

  const invoice: InvoiceDTO = orderInvoiceLink.invoice;

  if (invoice.status !== InvoiceStatus.COMPLETED) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Invoice not completed");
  }

  if (!invoice.pdf_url) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Invoice PDF URL is missing");
  }

  try {
    const response = await fetch(invoice.pdf_url);

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Failed to fetch PDF from storage: ${response.statusText}`,
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    const invoiceNumber = `invoice-${order.display_id}`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${invoiceNumber}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.byteLength);

    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error;
    }
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to retrieve invoice PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
