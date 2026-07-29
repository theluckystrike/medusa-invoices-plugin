import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { createInvoiceSettingsSchema } from "./admin/invoice-settings/validators";
import { adminGetInvoicesParams, generateInvoiceSchema } from "./admin/invoices/validators";

export const GetAdminInvoiceSettingsSchema = createFindParams();

const validateGetInvoicesMiddleware = validateAndTransformQuery(GetAdminInvoiceSettingsSchema, {
  defaults: ["*"],
  isList: true,
});

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
      matcher: "/admin/invoices/:order_id",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(adminGetInvoicesParams, {
          isList: true,
          defaults: [
            "id",
            "status",
            "completed_at",
            "pdf_url",
            "template_id",
            "template_version",
            "error_message",
            "order_display_id",
            "created_by_event",
            "created_at",
          ],
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
