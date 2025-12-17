import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INVOICE_MODULE } from "../modules/invoice/index";
import InvoiceModuleService from "../modules/invoice/service";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { InvoiceStatus } from "../constants/invoice";
import { GenerateInvoiceWorkflowInput } from "../types/invoice";

const validateOrderStep = createStep(
  "validate-order-exists-step",
  async ({ order_id }: GenerateInvoiceWorkflowInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data } = await query.graph({
      entity: "order",
      fields: ["id"],
      filters: { id: order_id },
      pagination: { take: 1 },
    });

    if (!data || !data.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${order_id} does not exist`,
      );
    }

    return new StepResponse(true);
  },
);

const generateInvoiceStep = createStep(
  "generate-invoice-step",
  async ({ opts }: GenerateInvoiceWorkflowInput, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    const [invoiceSettings] = await invoiceModuleService.listInvoiceSettings();

    if (!invoiceSettings) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Invoice settings does not exist",
      );
    }

    const invoice = await invoiceModuleService.createInvoices({
      status: InvoiceStatus.GENERATING,
      template_id: opts?.template_id ?? invoiceSettings.template_id,
      template_version: invoiceSettings.template_version,
      settings_snapshot: {
        template_id: invoiceSettings.template_id,
        template_version: invoiceSettings.template_version,
        header_logo: {
          type: invoiceSettings.header_logo_type,
          text: invoiceSettings.header_logo_text,
          url: invoiceSettings.header_logo_url,
        },
        header_content: invoiceSettings.header_content,
        footer_content: invoiceSettings.footer_content,
        store_name: invoiceSettings.store_name,
        store_address: invoiceSettings.store_address,
        store_tax_id: invoiceSettings.store_tax_id,
        bank_account_iban: invoiceSettings.bank_account_iban,
        bank_account_swift: invoiceSettings.bank_account_swift,
      },
      pdf_url: null,
      completed_at: null,
      error_message: null,
    });

    return new StepResponse(invoice, { id: invoice.id });
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    if (context?.id) {
      await invoiceModuleService.deleteInvoices(context.id);
    }
  },
);

const generateInvoiceWorkflow = createWorkflow(
  "generate-invoice-workflow",
  (input: GenerateInvoiceWorkflowInput) => {
    validateOrderStep(input);

    const invoice = generateInvoiceStep(input);

    createRemoteLinkStep([
      {
        [Modules.ORDER]: {
          order_id: input.order_id,
        },
        [INVOICE_MODULE]: {
          invoice_id: invoice.id,
        },
      },
    ]);

    return new WorkflowResponse(invoice);
  },
);

export default generateInvoiceWorkflow;
