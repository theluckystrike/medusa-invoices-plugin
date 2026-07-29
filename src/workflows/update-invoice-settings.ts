import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INVOICE_MODULE } from "../modules/invoice/index";
import InvoiceModuleService from "../modules/invoice/service";
import { createRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../constants/invoice";

export type UpsertInvoiceSettingsWorkflowInput = {
  store_id: string;
  template_id: InvoiceTemplateId;
  template_version: string;
  header_logo_type: InvoiceSettingsHeaderLogoType;
  header_logo_url: string | null;
  header_logo_text: string | null;
  header_content: Record<string, any> | null;
  footer_content: Record<string, any> | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
};

export type UpsertInvoiceSettingsStepInput = {
  input: Omit<UpsertInvoiceSettingsWorkflowInput, "store_id">;
  existing: any | null;
};

type RollbackContext = {
  action: "updated" | "created";
  previousData?: any | null;
  createdId?: string;
};

const upsertInvoiceSettingsStep = createStep(
  "upsert-invoice-settings-step",
  async ({ input, existing }: UpsertInvoiceSettingsStepInput, { container }) => {
    const invoiceModuleService: InvoiceModuleService = container.resolve(INVOICE_MODULE);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    logger.info(`invoices: Starting upsert invoice settings step`);

    const serializedInput = {
      ...input,
      header_content: input.header_content ? JSON.stringify(input.header_content) : null,
      footer_content: input.footer_content ? JSON.stringify(input.footer_content) : null,
    };

    if (existing) {
      logger.info(`invoices: Updating existing settings`);
      const updated = await invoiceModuleService.updateInvoiceSettings({
        id: existing.id,
        ...serializedInput,
      });

      const rollbackContext: RollbackContext = {
        action: "updated",
        previousData: existing,
      };

      logger.info(`invoices: Finished updating invoice settings`);
      return new StepResponse(updated, rollbackContext);
    }

    logger.info(`invoices: Creating new settings`);
    const created = await invoiceModuleService.createInvoiceSettings(serializedInput);

    const rollbackContext: RollbackContext = {
      action: "created",
      createdId: created.id,
    };

    logger.info(`invoices: Finished creating invoice settings`);
    return new StepResponse(created, rollbackContext);
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService = container.resolve(INVOICE_MODULE);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    if (context?.action === "created" && context?.createdId) {
      logger.info(`invoices: Rolling back created invoice settings`);
      await invoiceModuleService.deleteInvoiceSettings(context.createdId);
      return;
    }

    if (context?.action === "updated" && context?.previousData) {
      logger.info(`invoices: Rolling back updated invoice settings`);
      await invoiceModuleService.updateInvoiceSettings(
        context.previousData.id,
        context.previousData,
      );
    }
  },
);

const updateInvoiceSettingsWorkflow = createWorkflow(
  "upsert-invoice-settings-workflow",
  (input: UpsertInvoiceSettingsWorkflowInput) => {
    const storeData = useQueryGraphStep({
      entity: "store",
      fields: ["id", "invoice_settings.*"],
      filters: {
        id: input.store_id,
      },
    });

    const existing = transform(storeData, (res) => {
      const value = res.data[0].invoice_settings || null;
      return value;
    });

    const { store_id, ...settingsInput } = input;

    const settings = upsertInvoiceSettingsStep({
      input: settingsInput,
      existing,
    });

    const linkNeeded = transform({ existing }, ({ existing }) => !existing);

    when({ linkNeeded }, ({ linkNeeded }) => {
      return linkNeeded;
    }).then(() => {
      const settingsId = transform({ settings }, ({ settings }) => settings.id);

      createRemoteLinkStep([
        {
          [Modules.STORE]: {
            store_id: input.store_id,
          },
          [INVOICE_MODULE]: {
            invoice_settings_id: settingsId,
          },
        },
      ]);
    });

    return new WorkflowResponse(settings);
  },
);

export default updateInvoiceSettingsWorkflow;
