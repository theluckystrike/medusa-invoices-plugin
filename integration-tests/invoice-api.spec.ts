import { Modules } from "@medusajs/framework/utils";
import { generateJwtTokenForAuthIdentity } from "@medusajs/medusa/api/auth/utils/generate-jwt-token";
import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";
import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import InvoiceModuleService from "../src/modules/invoice/service";
import { INVOICE_MODULE } from "../src/modules/invoice";
import {
  InvoiceCreatedByEvent,
  InvoiceSettingsHeaderLogoType,
  InvoiceStatus,
  InvoiceTemplateId,
} from "../src/constants/invoice";

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Invoice endpoints", () => {
      beforeEach(async () => {
        const container = getContainer();
        const storeModuleService = container.resolve("store");
        const invoiceModuleService: InvoiceModuleService =
          container.resolve(INVOICE_MODULE);
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
      });
      describe("Admin API", () => {
        const headers: Record<string, string> = {};
        let order_id;
        let order_display_id;

        beforeEach(async () => {
          const container = getContainer();
          const userModuleService = container.resolve("user");
          const authModuleService = container.resolve("auth");
          const orderModuleService = container.resolve("order");

          const user = await userModuleService.createUsers({
            email: "admin@example.com",
          });

          const authIdentity = await authModuleService.createAuthIdentities({
            provider_identities: [
              {
                provider: "emailpass",
                entity_id: "admin@example.com",
                provider_metadata: {
                  password: "supersecret",
                },
              },
            ],
            app_metadata: {
              user_id: user.id,
            },
          });

          const token = generateJwtTokenForAuthIdentity(
            {
              authIdentity,
              actorType: "user",
              authProvider: "emailpass",
            },
            {
              secret: "supersecret",
              expiresIn: "1d",
            },
          );

          headers["authorization"] = `Bearer ${token}`;

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
          order_id = order.id;
          order_display_id = order.display_id;
        });

        describe("POST /admin/invoices/:order_id/generate", () => {
          it("create order invoice", async () => {
            const payload = {
              template_id: "compact",
            };

            const response = await api.post(
              `/admin/invoices/${order_id}/generate`,
              payload,
              {
                headers: {
                  Authorization: headers["authorization"],
                  "Content-Type": "application/json",
                },
              },
            );

            expect(response.status).toEqual(200);
            expect(response.data).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                order_display_id,
                status: "completed",
                completed_at: expect.any(String),
                pdf_url: expect.any(String),
                template_id: "compact",
                template_version: "1.0.0",
                settings_snapshot: expect.objectContaining({
                  store_name: null,
                  header_logo: expect.objectContaining({
                    url: null,
                    text: null,
                    type: "none",
                  }),
                  template_id: "clean",
                  store_tax_id: null,
                  store_address: null,
                  footer_content: null,
                  header_content: null,
                  template_version: "1.0.0",
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

        describe("GET /admin/invoices/:order_id", () => {
          it("returns order invoice", async () => {
            const container = getContainer();
            const invoiceModuleService: InvoiceModuleService =
              container.resolve(INVOICE_MODULE);
            const link = container.resolve("link");

            const invoice = await invoiceModuleService.createInvoices({
              order_id,
              order_display_id,
              status: InvoiceStatus.COMPLETED,
              completed_at: new Date(),
              pdf_url: "https://example.com/invoice.pdf",
              template_id: InvoiceTemplateId.CLEAN,
              template_version: "1.0.0",
              created_by_event: InvoiceCreatedByEvent.MANUAL,
              settings_snapshot: {
                store_name: null,
                header_logo: {
                  type: InvoiceSettingsHeaderLogoType.NONE,
                  text: null,
                  url: null,
                },
                template_id: InvoiceTemplateId.CLEAN,
                store_tax_id: null,
                store_address: null,
                footer_content: null,
                header_content: null,
                template_version: "1.0.0",
                bank_account_iban: null,
                bank_account_swift: null,
              },
              error_message: null,
            });

            await link.create({
              [Modules.ORDER]: {
                order_id,
              },
              invoice: {
                invoice_id: invoice.id,
              },
            });

            const response = await api.get(`/admin/invoices/${order_id}`, {
              headers: {
                Authorization: headers["authorization"],
                "Content-Type": "application/json",
              },
            });

            expect(response.status).toEqual(200);
            expect(response.data.invoices).toHaveLength(1);
            expect(response.data.invoices[0]).toEqual(
              expect.objectContaining({
                status: "completed",
                completed_at: expect.any(String),
                pdf_url: expect.any(String),
                template_id: "clean",
                template_version: "1.0.0",
                error_message: null,
                order_display_id,
              }),
            );
          });
        });
      });

      describe("Store API", () => {
        const headers: Record<string, string> = {};
        let order_id;
        let order_display_id;

        beforeEach(async () => {
          const container = getContainer();
          const authModuleService = container.resolve("auth");
          const customerModuleService = container.resolve("customer");
          const orderModuleService = container.resolve("order");

          const customer = await customerModuleService.createCustomers({
            email: "admin@example.com",
          });
          const authIdentity = await authModuleService.createAuthIdentities({
            provider_identities: [
              {
                provider: "emailpass",
                entity_id: "customer@example.com",
                provider_metadata: {
                  password: "supersecret",
                },
              },
            ],
            app_metadata: {
              customer_id: customer.id,
            },
          });

          const token = generateJwtTokenForAuthIdentity(
            {
              authIdentity,
              actorType: "customer",
              authProvider: "emailpass",
            },
            {
              secret: "supersecret",
              expiresIn: "1d",
            },
          );

          headers["authorization"] = `Bearer ${token}`;

          const pak = (
            await createApiKeysWorkflow(getContainer()).run({
              input: {
                api_keys: [
                  {
                    type: "publishable",
                    title: "Test Key",
                    created_by: "",
                  },
                ],
              },
            })
          ).result[0];

          headers["x-publishable-api-key"] = pak.token;

          const order = await orderModuleService.createOrders({
            customer_id: customer.id,
            currency_code: "eur",
            items: [
              {
                title: "Test Item",
                quantity: 1,
                unit_price: 1000,
              },
            ],
          });

          order_id = order.id;
          order_display_id = order.display_id;
        });
        describe("GET /store/invoices/:order_id.pdf", () => {
          it("returns order invoice pdf", async () => {
            const container = getContainer();
            const workflowsModuleService = container.resolve(
              Modules.WORKFLOW_ENGINE,
            );

            await workflowsModuleService.run("generate-invoice-workflow", {
              input: {
                order_id,
                template_id: "clean",
              },
            });

            const response = await api.get(`/store/invoices/${order_id}.pdf`, {
              headers: {
                Authorization: headers["authorization"],
                "x-publishable-api-key": headers["x-publishable-api-key"],
                "Content-Type": "application/pdf",
                Accept: "application/pdf",
              },
            });

            expect(response.status).toEqual(200);
            expect(response.headers["content-type"]).toEqual("application/pdf");
          });
        });
      });
    });
  },
});

jest.setTimeout(60 * 1000);
