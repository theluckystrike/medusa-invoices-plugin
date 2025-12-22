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
  emitEventStep,
} from "@medusajs/medusa/core-flows";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceStatus,
} from "../constants/invoice";
import {
  GenerateInvoiceWorkflowInput,
  InvoiceDTO,
  InvoiceSettingsSnapshot,
} from "../types/invoice";
import { InvoiceSettingsDTO } from "../types/invoice-settings";
import getTemp from "../templates/getTemp";
//import { getTemplate } from "../admin/components/templates/registry";

type RenderPdfStepInput = {
  order_id: string;
  invoice: InvoiceDTO;
  settings: InvoiceSettingsDTO;
};

const validateOrderStep = createStep(
  "validate-order-exists-step",
  async ({ order_id }: GenerateInvoiceWorkflowInput, { container }) => {
    const orderModuleService = container.resolve(Modules.ORDER);

    const order = await orderModuleService.retrieveOrder(order_id);

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${order_id} does not exist`,
      );
    }

    return new StepResponse({ order_display_id: order.display_id });
  },
);

const generateInvoiceStep = createStep(
  "generate-invoice-step",
  async (
    {
      order_display_id,
      opts,
    }: GenerateInvoiceWorkflowInput & { order_display_id: number },
    { container },
  ) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    const [invoiceSettings] = await invoiceModuleService.listInvoiceSettings();

    if (!invoiceSettings) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Invoice settings does not exist",
      );
    }

    const settings = {
      ...invoiceSettings,
      auto_generate_on:
        invoiceSettings.auto_generate_on as InvoiceSettingsAutoGenerateTrigger[],
    };

    const settingsSnapshot: InvoiceSettingsSnapshot = {
      template_id: settings.template_id,
      template_version: settings.template_version,
      header_logo: {
        type: settings.header_logo_type,
        text: settings.header_logo_text,
        url: settings.header_logo_url,
      },
      header_content: settings.header_content,
      footer_content: settings.footer_content,
      store_name: settings.store_name,
      store_address: settings.store_address,
      store_tax_id: settings.store_tax_id,
      bank_account_iban: settings.bank_account_iban,
      bank_account_swift: settings.bank_account_swift,
    };

    const invoice = await invoiceModuleService.createInvoices({
      status: InvoiceStatus.GENERATING,
      order_display_id: order_display_id,
      template_id: opts?.template_id ?? settings.template_id,
      template_version: settings.template_version,
      settings_snapshot: settingsSnapshot,
      pdf_url: null,
      completed_at: null,
      error_message: null,
    });

    return new StepResponse({ invoice, settings }, { id: invoice.id });
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    if (context?.id) {
      await invoiceModuleService.deleteInvoices(context.id);
    }
  },
);

const renderPdfStep = createStep(
  "render-pdf-step",
  async (
    { order_id, invoice, settings }: RenderPdfStepInput,
    { container },
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fileModuleService = container.resolve(Modules.FILE);
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status",
        "created_at",
        "canceled_at",
        "email",
        "display_id",
        "currency_code",
        "metadata",
        "total",
        "credit_line_total",
        "item_subtotal",
        "item_total",
        "item_tax_total",
        "original_item_tax_total",
        "item_discount_total",
        "shipping_subtotal",
        "original_total",
        "original_tax_total",
        "subtotal",
        "discount_total",
        "discount_subtotal",
        "shipping_total",
        "shipping_tax_total",
        "original_shipping_tax_total",
        "shipping_discount_total",
        "tax_total",
        "refundable_total",
        "order_change",
        "customer.*",
        "items.*",
        "items.variant.*",
        "items.variant.product.*",
        "items.variant.options.*",
        "items.variant.manage_inventory",
        "items.variant.inventory_items.inventory.*",
        "items.variant.inventory_items.required_quantity",
        "summary",
        "shipping_address.*",
        "billing_address.*",
        "sales_channel.*",
        "promotions.*",
        "shipping_methods.*",
        "credit_lines.*",
        "fulfillments.*",
        "fulfillments.shipping_option.service_zone.fulfillment_set.type",
        "fulfillments.items.*",
        "fulfillments.labels.*",
        "payment_collections.*",
        "payment_collections.payments.*",
        "payment_collections.payments.refunds.*",
        "payment_collections.payments.refunds.refund_reason.*",
        "region.automatic_taxes",
      ],
      filters: { id: order_id },
      pagination: { take: 1 },
    });

    const order = orders?.[0];

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${order_id} not found`,
      );
    }

    const ReactPDF = await import("@react-pdf/renderer");
    const element = await getTemp();

    const pdfStream = await ReactPDF.renderToStream(element);

    const pdfBuffer = await ReactPDF.renderToBuffer(element);
    const base64Pdf = pdfBuffer.toString("base64");

    const file = await fileModuleService.createFiles({
      filename: "invoice.pdf",
      mimeType: "application/pdf",
      content: base64Pdf,
    });

    if (!file) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Invoice PDF file was not created",
      );
    }

    const updatedInvoice = await invoiceModuleService.updateInvoices({
      id: invoice.id,
      pdf_url: file.url,
    });

    //const template = getTemplate(invoice.template_id);

    // if (!template) {
    //   throw new MedusaError(
    //     MedusaError.Types.INVALID_DATA,
    //     `Template ${invoice.template_id} not found`,
    //   );
    // }

    // const templateProps = {
    //   order,
    //   settings: {
    //     template_id: invoice.settings_snapshot.template_id,
    //     template_version: invoice.settings_snapshot.template_version,
    //     header_logo_type: invoice.settings_snapshot.header_logo.type,
    //     header_logo_text: invoice.settings_snapshot.header_logo.text,
    //     header_logo_url: invoice.settings_snapshot.header_logo.url,
    //     header_content: invoice.settings_snapshot.header_content,
    //     footer_content: invoice.settings_snapshot.footer_content,
    //     store_name: invoice.settings_snapshot.store_name,
    //     store_address: invoice.settings_snapshot.store_address,
    //     store_tax_id: invoice.settings_snapshot.store_tax_id,
    //     bank_account_iban: invoice.settings_snapshot.bank_account_iban,
    //     bank_account_swift: invoice.settings_snapshot.bank_account_swift,
    //   },
    // };

    // const Component = template.Component;
    //const pdfStream = await pdf(<Component {...templateProps} />)

    return new StepResponse(updatedInvoice, { updatedInvoice, order_id });
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    if (!context?.updatedInvoice.pdf_url) {
      await invoiceModuleService.generationFailed(
        context?.updatedInvoice.id!,
        "Invoice PDF file was not created",
        context?.order_id!,
      );
    }
  },
);

const completeInvoiceStep = createStep(
  "complete-invoice-step",
  async (
    { invoice, order_id }: { invoice: InvoiceDTO; order_id: string },
    { container },
  ) => {
    const invoiceModuleService: InvoiceModuleService =
      await container.resolve(INVOICE_MODULE);

    const completedInvoice = await invoiceModuleService.updateInvoices({
      id: invoice.id,
      status: InvoiceStatus.COMPLETED,
      completed_at: new Date(),
    });

    return new StepResponse(completedInvoice, {
      invoice: completedInvoice,
      order_id,
    });
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      await container.resolve(INVOICE_MODULE);

    if (
      !context?.invoice ||
      context.invoice.status !== InvoiceStatus.COMPLETED ||
      !context.invoice.completed_at
    ) {
      await invoiceModuleService.generationFailed(
        context?.invoice.id!,
        "Invoice completion failed",
        context?.order_id!,
      );
    }
  },
);

const generateInvoiceWorkflow = createWorkflow(
  "generate-invoice-workflow",
  (input: GenerateInvoiceWorkflowInput) => {
    const validateOrderResult = validateOrderStep(input);

    const generateInvoiceResult = generateInvoiceStep({
      ...input,
      ...validateOrderResult,
    });

    const invoice = transform(generateInvoiceResult, (input) => input.invoice);

    const settings = transform(
      generateInvoiceResult,
      (input) => input.settings,
    );

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

    const rederPdfStepResult = renderPdfStep({
      order_id: input.order_id,
      invoice,
      settings,
    });

    const completeInvoiceStepResult = completeInvoiceStep({
      invoice: rederPdfStepResult,
      order_id: input.order_id,
    });

    const eventPayload = transform(completeInvoiceStepResult, (input) => ({
      invoice_id: input.id,
      order_display_id: input.order_display_id,
      pdf_url: input.pdf_url,
      template_id: input.template_id,
      template_version: input.template_version,
      completed_at: input.completed_at,
    }));

    emitEventStep({
      eventName: "invoice.generated",
      data: {
        ...eventPayload,
        order_id: input.order_id,
      },
    });

    return new WorkflowResponse(completeInvoiceStepResult);
  },
);

export default generateInvoiceWorkflow;
