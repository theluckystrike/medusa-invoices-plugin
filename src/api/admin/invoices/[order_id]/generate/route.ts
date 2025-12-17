import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import createInvoiceWorkflow from "../../../../../workflows/generate-invoice";
import { GenerateInvoiceRequestBody } from "../../validators";

export async function POST(
  req: MedusaRequest<GenerateInvoiceRequestBody>,
  res: MedusaResponse,
) {
  const { order_id } = req.params;
  const { opts } = req.validatedBody ?? {};

  const { result } = await createInvoiceWorkflow(req.scope).run({
    input: { order_id, opts },
  });

  res.json(result);
}
