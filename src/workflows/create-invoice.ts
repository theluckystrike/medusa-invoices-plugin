import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INVOICE_MODULE } from "../modules/invoice/index";
import InvoiceModuleService from "../modules/invoice/service";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRemoteLinkStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";

export type CreateInvoiceWorkflowInput = {
  order_id: string;
};

const validateOrderStep = createStep(
  "validate-order-exists-step",
  async ({ order_id }: CreateInvoiceWorkflowInput, { container }) => {
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

const createInvoiceStep = createStep(
  "create-invoice-step",
  async (input: { invoices?: any[] }, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    if (input.invoices && input.invoices.length > 0) {
      await invoiceModuleService.deactivateInvoices(input.invoices);
    }
    const number = await invoiceModuleService.generateInvoiceNumber();
    const invoice = await invoiceModuleService.createInvoices({ number });

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

export const createInvoiceWorkflow = createWorkflow(
  "create-invoice-workflow",
  (invoiceInput: CreateInvoiceWorkflowInput) => {
    validateOrderStep(invoiceInput);

    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: ["id", "invoices.*"],
      filters: {
        id: invoiceInput.order_id,
      },
    });

    const existingInvoices = transform(orders, (res) => {
      const order = res?.[0];
      console.log(order);
      return order?.invoices || [];
    });

    const invoice = createInvoiceStep({ invoices: existingInvoices });

    createRemoteLinkStep([
      {
        [Modules.ORDER]: {
          order_id: invoiceInput.order_id,
        },
        [INVOICE_MODULE]: {
          invoice_id: invoice.id,
        },
      },
    ]);

    return new WorkflowResponse(invoice);
  },
);
