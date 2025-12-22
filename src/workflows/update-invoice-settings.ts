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
import {
  createRemoteLinkStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
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
  async (
    { input, existing }: UpsertInvoiceSettingsStepInput,
    { container },
  ) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    const serializedInput = {
      ...input,
      header_content: input.header_content
        ? JSON.stringify(input.header_content)
        : null,
      footer_content: input.footer_content
        ? JSON.stringify(input.footer_content)
        : null,
    };

    if (existing) {
      const updated = await invoiceModuleService.updateInvoiceSettings({
        id: existing.id,
        ...serializedInput,
      });

      const rollbackContext: RollbackContext = {
        action: "updated",
        previousData: existing,
      };

      return new StepResponse(updated, rollbackContext);
    }

    const created =
      await invoiceModuleService.createInvoiceSettings(serializedInput);

    const rollbackContext: RollbackContext = {
      action: "created",
      createdId: created.id,
    };

    return new StepResponse(created, rollbackContext);
  },
  async (context, { container }) => {
    const invoiceModuleService: InvoiceModuleService =
      container.resolve(INVOICE_MODULE);

    if (context?.action === "created" && context?.createdId) {
      await invoiceModuleService.deleteInvoiceSettings(context.createdId);
      return;
    }

    if (context?.action === "updated" && context?.previousData) {
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
      createRemoteLinkStep([
        {
          [Modules.STORE]: {
            store_id: input.store_id,
          },
          [INVOICE_MODULE]: {
            invoice_settings_id: settings.id,
          },
        },
      ]);
    });

    return new WorkflowResponse(settings);
  },
);

export default updateInvoiceSettingsWorkflow;
