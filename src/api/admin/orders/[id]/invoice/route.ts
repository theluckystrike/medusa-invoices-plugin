import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderId = req.params.id;
  const { fields } = req.validatedQuery || {};

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: invoiceTemplates } = await query.graph({
    entity: "invoice_template",
    fields: ["*", ...(fields || [])],
    filters: { order_id: orderId },
    pagination: { take: 1, skip: 0 },
  });

  const invoiceTemplate = invoiceTemplates?.[0];

  if (!invoiceTemplate) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invoice template for order with id ${orderId} was not found`,
    );
  }

  res.json(invoiceTemplate);
}
