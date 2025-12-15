import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { createInvoiceSettingsSchema } from "./admin/invoice-settings/validators";

export const GetAdminInvoiceSettingsSchema = createFindParams();

const validateGetInvoicesMiddleware = validateAndTransformQuery(
  GetAdminInvoiceSettingsSchema,
  { defaults: ["*"], isList: true },
);

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/invoice-settings/",
      method: "PUT",
      middlewares: [validateAndTransformBody(createInvoiceSettingsSchema)],
    },
    {
      matcher: "/admin/invoices/",
      method: "GET",
      middlewares: [validateGetInvoicesMiddleware],
    },
    {
      matcher: "/admin/orders/:id/invoice",
      method: "GET",
      middlewares: [validateGetInvoicesMiddleware],
    },
  ],
});
