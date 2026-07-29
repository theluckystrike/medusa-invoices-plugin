import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { order_id } = req.params;
  const { created_by_event, status, template_version } = req.query;

  if (!order_id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Order ID is required.");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const filters: Record<string, any> = {
    order_id,
  };

  if (status) {
    filters.status = status;
  }
  if (created_by_event) {
    filters.created_by_event = created_by_event;
  }
  if (template_version) {
    filters.template_version = template_version;
  }

  const { data: orderInvoices, metadata } = await query.graph({
    entity: "invoice",
    ...req.queryConfig,
    pagination: {
      ...(req.queryConfig?.pagination || {}),
      order: req.queryConfig?.pagination?.order ?? {
        created_at: "DESC",
      },
    },
    filters,
  });

  res.json({
    invoices: orderInvoices,
    count: metadata?.count || 0,
    offset: metadata?.skip || 0,
    limit: metadata?.take || 0,
  });
}
