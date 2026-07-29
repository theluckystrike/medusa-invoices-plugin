import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import updateInvoiceSettingsWorkflow, {
  UpsertInvoiceSettingsWorkflowInput,
} from "../../../workflows/update-invoice-settings";
import { InvoiceSettingsDTO } from "../../../types/invoice-settings";
import { InvoiceSettingsAutoGenerateTrigger } from "../../../constants/invoice";

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
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No active store found");
  }

  const {
    data: [storeWithSettings],
  } = await query.graph({
    entity: "store",
    fields: ["id", "invoice_settings.*"],
    filters: { id: store.id },
  });

  const invoiceSettings: InvoiceSettingsDTO | null = storeWithSettings?.invoice_settings;

  if (!invoiceSettings) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Invoice settings not found.");
  }

  const invoiceSettingsResponse = {
    settings: invoiceSettings,
    templates: [
      {
        id: "clean",
        label: "Clean",
        version: "1.0.0",
      },
      {
        id: "classic",
        label: "Classic",
        version: "1.0.0",
      },
      {
        id: "compact",
        label: "Compact",
        version: "1.0.0",
      },
    ],
    availableTriggers: [
      InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED,
      InvoiceSettingsAutoGenerateTrigger.FULFILLMENT_CREATED,
      InvoiceSettingsAutoGenerateTrigger.PAYMENT_CAPTURED,
    ],
  };

  res.json(invoiceSettingsResponse);
}

export async function POST(
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
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No active store found");
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
