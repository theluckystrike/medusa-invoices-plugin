import {
  AbstractEventBusModuleService,
  MedusaError,
  MedusaService,
} from "@medusajs/framework/utils";
import Invoice from "./models/invoice";
import InvoiceSettings from "./models/invoice_settings";
import { InvoiceStatus } from "../../constants/invoice";

class InvoiceModuleService extends MedusaService({
  Invoice,
  InvoiceSettings,
}) {
  protected eventBusService_: AbstractEventBusModuleService;

  constructor({ event_bus }) {
    super(...arguments);
    this.eventBusService_ = event_bus;
  }

  async generationFailed(id: string, error_message: string, order_id: string) {
    const failedInvoice = await this.updateInvoices({
      id,
      status: InvoiceStatus.FAILED,
      error_message,
      completed_at: null,
    });

    if (
      !failedInvoice ||
      failedInvoice.status !== InvoiceStatus.FAILED ||
      failedInvoice.completed_at !== null
    ) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to mark invoice ${id} as FAILED`,
      );
    }

    this.eventBusService_.emit(
      {
        name: "invoice.failed",
        data: {
          order_id,
          error_message,
        },
      },
      {},
    );
  }
}

export default InvoiceModuleService;
