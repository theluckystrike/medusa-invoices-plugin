import { Modules } from "@medusajs/framework/utils";
import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import InvoiceModuleService from "../src/modules/invoice/service";
import { INVOICE_MODULE } from "../src/modules/invoice";
import {
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../src/constants/invoice";
import generateInvoiceWorkflow from "../src/workflows/generate-invoice";

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Test generate-invoice-workflow", () => {
      let orderId;
      let orderDisplayId;

      beforeEach(async () => {
        const container = getContainer();
        const storeModuleService = container.resolve("store");
        const invoiceModuleService: InvoiceModuleService =
          container.resolve(INVOICE_MODULE);
        const orderModuleService = container.resolve("order");
        const link = container.resolve("link");

        let store;

        const [retrievedStore] = await storeModuleService.listStores();
        store = retrievedStore;

        if (!store) {
          const [createdStore] = await storeModuleService.createStores([
            {
              name: "Test Store",
              supported_currencies: [
                { currency_code: "eur", is_default: true },
              ],
            },
          ]);

          store = createdStore;
        }

        const invoiceSettings =
          await invoiceModuleService.createInvoiceSettings({
            template_id: InvoiceTemplateId.CLEAN,
            template_version: "1.0.0",
            header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
            header_logo_text: null,
            header_logo_url: null,
            header_content: null,
            footer_content: null,
            store_name: null,
            store_address: null,
            store_tax_id: null,
            bank_account_iban: null,
            bank_account_swift: null,
            auto_generate_on: [],
          });

        await link.create({
          [Modules.STORE]: {
            store_id: store.id,
          },
          invoice: {
            invoice_settings_id: invoiceSettings.id,
          },
        });

        const order = await orderModuleService.createOrders({
          currency_code: "eur",
          items: [
            {
              title: "Test Item",
              quantity: 1,
              unit_price: 1000,
            },
          ],
        });

        orderId = order.id;
        orderDisplayId = order.display_id;
      });

      describe("Success scenario", () => {
        it("should generate invoice for specific order", async () => {
          const container = getContainer();

          const input = {
            order_id: orderId,
            template_id: InvoiceTemplateId.COMPACT,
          };

          const { result } = await generateInvoiceWorkflow(container).run({
            input,
          });

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              order_display_id: orderDisplayId,
              status: "completed",
              completed_at: expect.any(String),
              pdf_url: expect.any(String),
              template_id: "compact",
              template_version: "1.0.0",
              settings_snapshot: expect.objectContaining({
                template_id: "clean",
                template_version: "1.0.0",
                header_logo: expect.objectContaining({
                  type: "none",
                  text: null,
                  url: null,
                }),
                header_content: null,
                footer_content: null,
                store_name: null,
                store_address: null,
                store_tax_id: null,
                bank_account_iban: null,
                bank_account_swift: null,
              }),
              error_message: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            }),
          );
        });
      });

      describe("Failure and compensation scenario", () => {
        it("should roll back changes if the workflow fails", async () => {
          const container = getContainer();

          const { errors } = await generateInvoiceWorkflow(container).run({
            input: { order_id: "invalid-id" },
            throwOnError: false,
          });

          expect(errors).toBeDefined();
          expect(errors.length).toBeGreaterThan(0);
        });
      });
    });
  },
});

jest.setTimeout(60 * 1000);
