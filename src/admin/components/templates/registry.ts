import React from "react";
import { InvoiceTemplateId } from "../../../constants/invoice";
import { AdminOrder } from "@medusajs/framework/types";
import { TemplateSettings } from "../../routes/settings/invoices/page";
import CleanTemplate from "./CleanTemplate";
import ClassicTemplate from "./ClassicTemplate";
import CompactTemplate from "./CompactTemplate";

export type TemplateProps = {
  order?: AdminOrder;
  settings?: TemplateSettings;
};

export type InvoiceTemplate = {
  id: InvoiceTemplateId;
  version: string;
  Component: React.FC<TemplateProps>;
};

export const templates: Record<string, InvoiceTemplate> = {
  clean: {
    id: InvoiceTemplateId.CLEAN,
    version: "1.0.0",
    Component: CleanTemplate,
  },
  classic: {
    id: InvoiceTemplateId.CLASSIC,
    version: "1.0.0",
    Component: ClassicTemplate,
  },
  compact: {
    id: InvoiceTemplateId.COMPACT,
    version: "1.0.0",
    Component: CompactTemplate,
  },
};

export function getTemplate(id: string) {
  return templates[id];
}
