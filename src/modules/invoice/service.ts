import { MedusaService } from "@medusajs/framework/utils";
import Invoice from "./models/invoice";
import InvoiceSettings from "./models/invoice_settings";

class InvoiceModuleService extends MedusaService({
  Invoice,
  InvoiceSettings,
}) {
  async generateInvoiceNumber(year?: number): Promise<string> {
    const currentYear = year || new Date().getFullYear();

    const lastInvoice = await this.listInvoices(
      {
        number: {
          $like: `INV-${currentYear}-%`,
        },
      },
      {
        take: 1,
        order: { number: "DESC" },
      },
    );

    let nextNumber = 1;
    if (lastInvoice.length > 0) {
      const match = lastInvoice[0].number.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    return `INV-${currentYear}-${nextNumber.toString().padStart(5, "0")}`;
  }

  async deactivateInvoices(invoices) {
    console.log(invoices);

    return this.updateInvoices(
      invoices.map((inv) => ({ id: inv.id, is_active: false })),
    );
  }
}

export default InvoiceModuleService;
