import { MedusaError } from "@medusajs/framework/utils";
import { InvoiceTemplateId } from "../constants/invoice";
import { InvoiceTemplate } from "../types/templates";
import createTemplate from "./createTemplate";
import classicTemplate from "./styles/classicTemplate";
import cleanTemplate from "./styles/cleanTemplate";
import compactTemplate from "./styles/compactTemplate";

export const templates: Record<InvoiceTemplateId, InvoiceTemplate> = {
  clean: {
    id: InvoiceTemplateId.CLEAN,
    version: "1.0.0",
    render: (props) => createTemplate({ ...props, _styles: cleanTemplate }),
  },
  classic: {
    id: InvoiceTemplateId.CLASSIC,
    version: "1.0.0",
    render: (props) => createTemplate({ ...props, _styles: classicTemplate }),
  },
  compact: {
    id: InvoiceTemplateId.COMPACT,
    version: "1.0.0",
    render: (props) => createTemplate({ ...props, _styles: compactTemplate }),
  },
};

export function getTemplate(id: InvoiceTemplateId): InvoiceTemplate {
  const template = templates[id];

  if (!template) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Template ${id} not found`,
    );
  }

  return template;
}
