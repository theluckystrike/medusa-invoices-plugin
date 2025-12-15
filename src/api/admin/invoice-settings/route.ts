import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  updateInvoiceSettingsWorkflow,
  UpsertInvoiceSettingsWorkflowInput,
} from "../../../workflows/update-invoice-settings";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["id"],
    pagination: { take: 1 },
  });

  if (!store) {
    throw new Error("No active store found");
  }

  const {
    data: [storeWithSettings],
  } = await query.graph({
    entity: "store",
    fields: ["id", "invoice_settings.*"],
    filters: { id: store.id },
  });

  res.json(storeWithSettings?.invoice_settings ?? null);
}

export async function PUT(
  req: MedusaRequest<Omit<UpsertInvoiceSettingsWorkflowInput, "store_id">>,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["id"],
    pagination: { take: 1 },
  });

  if (!store) {
    throw new Error("No active store found");
  }

  const input: UpsertInvoiceSettingsWorkflowInput = {
    ...req.validatedBody,
    store_id: store.id,
  };

  const { result } = await updateInvoiceSettingsWorkflow(req.scope).run({
    input,
  });

  res.json(result);
}
