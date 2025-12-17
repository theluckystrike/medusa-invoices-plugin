import { MedusaService } from "@medusajs/framework/utils";
import Invoice from "./models/invoice";
import InvoiceSettings from "./models/invoice_settings";

class InvoiceModuleService extends MedusaService({
  Invoice,
  InvoiceSettings,
}) {}

export default InvoiceModuleService;
