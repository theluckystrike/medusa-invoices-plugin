import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils";
import { INVOICE_MODULE } from "..";
import InvoiceModuleService from "../service";
import InvoiceSettings from "../models/invoice_settings";
import Invoice from "../models/invoice";
import {
  InvoiceSettingsHeaderLogoType,
  InvoiceStatus,
  InvoiceTemplateId,
  InvoiceCreatedByEvent,
} from "../../../constants/invoice";

moduleIntegrationTestRunner<InvoiceModuleService>({
  moduleName: INVOICE_MODULE,
  moduleModels: [InvoiceSettings, Invoice],
  resolve: "./src/modules/invoice",
  testSuite: ({ service }) => {
    describe("InvoiceModuleService", () => {
      it("updates invoice as FAILED and emits event", async () => {
        const invoice = await service.createInvoices({
          template_id: InvoiceTemplateId.CLEAN,
          template_version: "1.0.0",
          order_id: "order_123",
          order_display_id: 52,
          status: InvoiceStatus.GENERATING,
          pdf_url: "http://example.png",
          created_by_event: InvoiceCreatedByEvent.MANUAL,
          settings_snapshot: {
            template_id: InvoiceTemplateId.CLEAN,
            template_version: "1.0.0",
            header_logo: {
              type: InvoiceSettingsHeaderLogoType.NONE,
              text: null,
              url: null,
            },
            header_content: null,
            footer_content: null,
            store_name: null,
            store_address: null,
            store_tax_id: null,
            bank_account_iban: null,
            bank_account_swift: null,
          },
          error_message: null,
          completed_at: new Date(),
        });

        await service.generationFailed(invoice.id, "Some error", "order_123");

        const updated = await service.retrieveInvoice(invoice.id);

        expect(updated.status).toEqual(InvoiceStatus.FAILED);
        expect(updated.error_message).toEqual("Some error");
        expect(updated.completed_at).toBeNull();
      });
    });
  },
});

jest.setTimeout(60 * 1000);
