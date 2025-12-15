import { defineLink } from "@medusajs/framework/utils";
import StoreModule from "@medusajs/medusa/store";
import InvoiceModule from "../modules/invoice";

export default defineLink(StoreModule.linkable.store, {
  linkable: InvoiceModule.linkable.invoiceSettings,
  deleteCascade: true,
});
