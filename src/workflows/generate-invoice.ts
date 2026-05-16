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
  InvoiceCreatedByEvent,
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceStatus,
  InvoiceTemplateId,
} from "../constants/invoice";
import { GenerateInvoiceWorkflowInput, InvoiceDTO } from "../types/invoice";
import { getTemplate } from "../templates/registry";
import { TemplateProps, TemplateSettingsForTemplate } from "../templates/types";

type GenerateInvoiceStepInput = {
  order_id: string;
  order_display_id: number;
  template_id: InvoiceTemplateId | undefined;
  created_by_event: InvoiceCreatedByEvent;
};

type RenderPdfStepInput = {
  order_id: string;
  invoice: InvoiceDTO;
};

type CompleteInvoiceStepInput = { invoice: InvoiceDTO; order_id: string };

const validateOrderStep = createStep(
  "validate-order-exists-step",
  async ({ order_id }: GenerateInvoiceWorkflowInput, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const orderModuleService = container.resolve(Modules.ORDER);

    const order = await orderModuleService.retrieveOrder(order_id);

    logger.info(`invoices: Validating order existence`);

    if (!order) {
      logger.error(`invoices: Validation failed: Order not found`);

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${order_id} does not exist`,
      );
    }

    logger.info(`invoices: Order validated successfully`);

    return new StepResponse({
      order_display_id: order.display_id,
    });
  },
);

const generateInvoiceStep = createStep(
  "generate-invoice-step",
  async (
    {
      order_id,
      order_display_id,
      template_id,
      created_by_event,
    }: GenerateInvoiceStepInput,
    { container },
  ) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    logger.info(`invoices: Starting invoice generation`);

    const [invoiceSettings] = await invoiceModuleService.listInvoiceSettings();

    if (!invoiceSettings) {
      logger.error(`invoices: Invoice settings not found`);
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

    const settingsSnapshot: TemplateSettingsForTemplate = {
      template_id: settings.template_id,
      template_version: settings.template_version,
      header_logo: {
        type: settings.header_logo_type,
        text: settings.header_logo_text,
        url: settings.header_logo_url,
      },
      header_content: settings.header_content
        ? JSON.parse(settings.header_content)
        : null,
      footer_content: settings.footer_content
        ? JSON.parse(settings.footer_content)
        : null,
      store_name: settings.store_name,
      store_address: settings.store_address,
      store_tax_id: settings.store_tax_id,
      bank_account_iban: settings.bank_account_iban,
      bank_account_swift: settings.bank_account_swift,
    };

    const invoice = await invoiceModuleService.createInvoices({
      order_id: order_id,
      order_display_id: order_display_id,
      status: InvoiceStatus.GENERATING,
      template_id: template_id ?? settings.template_id,
      template_version: settings.template_version,
      settings_snapshot: settingsSnapshot,
      pdf_url: null,
      completed_at: null,
      error_message: null,
      created_by_event: created_by_event,
    });

    if (!invoice) {
      logger.error(`invoices: Invoice creation failed`);
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Invoice creation failed",
      );
    }

    logger.info(`invoices: Invoice generated for order successfully`);

    return new StepResponse({ invoice }, { id: invoice.id });
  },
  async (context, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    logger.warn("invoices: Rolling back invoice generation");

    if (context?.id) {
      await invoiceModuleService.deleteInvoices(context.id);
    }
  },
);

const renderPdfStep = createStep(
  "render-pdf-step",
  async ({ order_id, invoice }: RenderPdfStepInput, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fileModuleService = container.resolve(Modules.FILE);
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    logger.info(`invoices: Starting PDF rendering for order invoice`);

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
        "total",
        "subtotal",
        "discount_total",
        "shipping_total",
        "tax_total",
        "customer.*",
        "items.*",
        "items.variant.*",
        "shipping_address.*",
        "billing_address.*",
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

    const template = getTemplate(invoice.template_id);

    const templateProps: TemplateProps = {
      order,
      settings: {
        template_id: invoice.settings_snapshot.template_id,
        template_version: invoice.settings_snapshot.template_version,
        header_logo: invoice.settings_snapshot.header_logo,
        header_content: invoice.settings_snapshot.header_content,
        footer_content: invoice.settings_snapshot.footer_content,
        store_name: invoice.settings_snapshot.store_name,
        store_address: invoice.settings_snapshot.store_address,
        store_tax_id: invoice.settings_snapshot.store_tax_id,
        bank_account_iban: invoice.settings_snapshot.bank_account_iban,
        bank_account_swift: invoice.settings_snapshot.bank_account_swift,
      },
      invoice: {
        id: invoice.id,
        created_at: invoice.created_at,
        display_number: invoice.order_display_id,
      },
    };

    const element = await template.render(templateProps);

    const pdfBuffer = await ReactPDF.renderToBuffer(element);
    const base64Pdf = pdfBuffer.toString("base64");

    const file = await fileModuleService.createFiles({
      filename: "invoice.pdf",
      mimeType: "application/pdf",
      content: base64Pdf,
    });

    if (!file) {
      logger.error(`invoices: PDF file creation failed for order invoice`);

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Invoice PDF file was not created",
      );
    }

    const updatedInvoice = await invoiceModuleService.updateInvoices({
      id: invoice.id,
      pdf_url: file.url,
    });

    if (!updatedInvoice) {
      logger.error(`invoices: Invoice pdf url update failed`);

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Invoice pdf url update failed",
      );
    }

    logger.info(
      `invoices: PDF rendered and uploaded successfully for order invoice`,
    );

    return new StepResponse(updatedInvoice, {
      updatedInvoice,
      order_id,
      file_id: file.id,
    });
  },
  async (context, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);
    const fileModuleService = container.resolve(Modules.FILE);

    logger.warn("invoices: Rolling back PDF rendering for order invoice");

    if (
      !context?.updatedInvoice?.id ||
      !context?.order_id ||
      !context?.file_id
    ) {
      return;
    }

    if (!context.updatedInvoice.pdf_url) {
      await invoiceModuleService.generationFailed(
        context?.updatedInvoice.id!,
        "Invoice PDF file was not created",
        context?.order_id!,
      );

      await fileModuleService.deleteFiles(context.file_id);
    }
  },
);

const completeInvoiceStep = createStep(
  "complete-invoice-step",
  async ({ invoice, order_id }: CompleteInvoiceStepInput, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const invoiceModuleService: InvoiceModuleService =
      await container.resolve(INVOICE_MODULE);

    logger.info(`invoices: Starting completion for order invoice`);

    const completedInvoice = await invoiceModuleService.updateInvoices({
      id: invoice.id,
      status: InvoiceStatus.COMPLETED,
      completed_at: new Date(),
    });

    if (!completedInvoice) {
      logger.error(`invoices: Invoice completion failed`);

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Invoice completion failed",
      );
    }

    logger.info(`invoices: Invoice completed successfully`);

    return new StepResponse(
      {
        invoice: completedInvoice,
        order_id,
      },
      {
        invoice: completedInvoice,
        order_id,
      },
    );
  },
  async (context, { container }) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const invoiceModuleService: InvoiceModuleService =
      await container.resolve(INVOICE_MODULE);

    logger.warn("invoices: Rolling back invoice completion");

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

    const generateInvoiceStepInput = transform(
      { validateOrderResult, input },
      ({ validateOrderResult, input }) => ({
        order_id: input.order_id,
        order_display_id: validateOrderResult.order_display_id,
        template_id: input.template_id,
        created_by_event:
          input.created_by_event ?? InvoiceCreatedByEvent.MANUAL,
      }),
    );

    const generateInvoiceResult = generateInvoiceStep(generateInvoiceStepInput);

    const invoice = transform(generateInvoiceResult, (input) => input.invoice);

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

    const renderPdfStepResult = renderPdfStep({
      order_id: input.order_id,
      invoice,
    });

    const completeInvoiceStepResult = completeInvoiceStep({
      invoice: renderPdfStepResult,
      order_id: input.order_id,
    });

    const eventPayload = transform(completeInvoiceStepResult, (input) => ({
      invoice_id: input.invoice.id,
      order_id: input.order_id,
      order_display_id: input.invoice.order_display_id,
      pdf_url: input.invoice.pdf_url,
      template_id: input.invoice.template_id,
      template_version: input.invoice.template_version,
      completed_at: input.invoice.completed_at,
    }));

    emitEventStep({
      eventName: "invoice.generated",
      data: eventPayload,
    });

    return new WorkflowResponse(completeInvoiceStepResult.invoice);
  },
);

export default generateInvoiceWorkflow;
