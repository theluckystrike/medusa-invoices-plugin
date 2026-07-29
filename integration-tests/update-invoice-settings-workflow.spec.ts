import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import InvoiceModuleService from "../src/modules/invoice/service";
import { INVOICE_MODULE } from "../src/modules/invoice";
import updateInvoiceSettingsWorkflow from "../src/workflows/update-invoice-settings";
import { InvoiceSettingsHeaderLogoType, InvoiceTemplateId } from "../src/constants/invoice";

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Test upsert-invoice-settings-workflow", () => {
      let storeId: string;
      const inputBase = {
        template_id: InvoiceTemplateId.CLEAN,
        template_version: "1.0.0",
        header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
        header_logo_url: null,
        header_logo_text: null,
        header_content: null,
        footer_content: null,
        store_name: null,
        store_address: null,
        store_tax_id: null,
        bank_account_iban: null,
        bank_account_swift: null,
        auto_generate_on: [],
      };

      beforeAll(async () => {
        const container = getContainer();
        const storeModuleService = container.resolve("store");

        const store = await storeModuleService.createStores({
          name: "Test Store",
          supported_currencies: [
            { currency_code: "eur", is_default: true },
            { currency_code: "usd" },
          ],
        });

        storeId = store.id;
      });

      describe("Success scenario", () => {
        it("should create new invoice settings and link to store", async () => {
          const container = getContainer();

          const { result } = await updateInvoiceSettingsWorkflow(container).run({
            input: {
              store_id: storeId,
              ...inputBase,
            },
          });

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              template_id: "clean",
              template_version: "1.0.0",
              header_logo_type: "none",
              header_logo_url: null,
              header_logo_text: null,
              header_content: null,
              footer_content: null,
              store_name: null,
              store_address: null,
              store_tax_id: null,
              bank_account_iban: null,
              bank_account_swift: null,
              auto_generate_on: [],
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            }),
          );
        });
      });

      describe("Failure and compensation scenario", () => {
        it("should roll back created settings if a later step fails", async () => {
          const container = getContainer();
          const invoiceModuleService: InvoiceModuleService = container.resolve(INVOICE_MODULE);

          const { errors } = await updateInvoiceSettingsWorkflow(container).run({
            input: { ...inputBase, store_id: "non-existent-id" },
            throwOnError: false,
          });

          expect(errors.length).toBeGreaterThan(0);

          const settings = await invoiceModuleService.listInvoiceSettings();

          expect(settings.length).toBe(0);
        });
      });
    });
  },
});

jest.setTimeout(60 * 1000);
