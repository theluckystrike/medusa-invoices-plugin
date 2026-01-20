import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { createInvoiceSettingsSchema } from "./admin/invoice-settings/validators";
import { generateInvoiceSchema } from "./admin/invoices/validators";

export const GetAdminInvoiceSettingsSchema = createFindParams();

const validateGetInvoicesMiddleware = validateAndTransformQuery(
  GetAdminInvoiceSettingsSchema,
  { defaults: ["*"], isList: true },
);

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/invoice-settings/",
      method: "POST",
      middlewares: [validateAndTransformBody(createInvoiceSettingsSchema)],
    },
    {
      matcher: "/admin/invoices/",
      method: "GET",
      middlewares: [validateGetInvoicesMiddleware],
    },
    {
      matcher: "/admin/orders/:order_id/invoices",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(createFindParams(), {
          isList: true,
          defaults: [
            "invoice.status",
            "invoice.completed_at",
            "invoice.pdf_url",
            "invoice.template_id",
            "invoice.template_version",
            "invoice.error_message",
            "invoice.order_display_id",
            "created_by_event",
          ],
          defaultLimit: 24,
        }),
      ],
    },
    {
      matcher: "/admin/invoices/:order_id/generate",
      method: "POST",
      middlewares: [validateAndTransformBody(generateInvoiceSchema)],
    },
    {
      matcher: "/store/invoices/:order_id.pdf",
      method: "GET",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
});
