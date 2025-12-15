import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createInvoiceWorkflow } from "../../../../../workflows/create-invoice";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { order_id } = req.params;
  const { result } = await createInvoiceWorkflow(req.scope).run({
    input: { order_id },
  });

  res.json(result);
}
