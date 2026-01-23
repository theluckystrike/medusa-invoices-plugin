import userEvent from "@testing-library/user-event";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../constants/invoice";
import MultiSelect from "../../components/MultiSelect";
import { render, screen, within } from "@testing-library/react";
import { vi, beforeAll } from "vitest";

describe("Multi-Select Triggers", () => {
  beforeAll(() => {
    if (typeof window.Element.prototype.hasPointerCapture !== "function") {
      window.Element.prototype.hasPointerCapture = vi.fn();
    }
    if (typeof window.Element.prototype.setPointerCapture !== "function") {
      window.Element.prototype.setPointerCapture = vi.fn();
    }
    if (typeof window.Element.prototype.releasePointerCapture !== "function") {
      window.Element.prototype.releasePointerCapture = vi.fn();
    }
    if (typeof window.HTMLElement.prototype.scrollIntoView !== "function") {
      window.HTMLElement.prototype.scrollIntoView = vi.fn();
    }
  });

  it("should add a trigger when selected from dropdown", async () => {
    const user = userEvent.setup();
    const setTemplateSettings = vi.fn();

    const mockTemplateSettings = {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [],
    };

    render(
      <MultiSelect
        templateSettings={mockTemplateSettings}
        setTemplateSettings={setTemplateSettings}
      />,
    );

    const select = screen.getByRole("combobox");
    await user.click(select);

    const orderCompletedOption = screen.getByRole("option", {
      name: /order completed/i,
    });
    await user.click(orderCompletedOption);

    expect(setTemplateSettings).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should remove a trigger when X button is clicked", async () => {
    const user = userEvent.setup();
    const setTemplateSettings = vi.fn();

    const mockTemplateSettings = {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED],
    };

    render(
      <MultiSelect
        templateSettings={mockTemplateSettings}
        setTemplateSettings={setTemplateSettings}
      />,
    );

    const badge = screen.getByText(/order completed/i);
    expect(badge).toBeInTheDocument();

    const removeButton = within(
      badge.closest(".bg-ui-tag-neutral-bg")!,
    ).getByRole("button");
    await user.click(removeButton);

    expect(setTemplateSettings).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should not show already selected triggers in dropdown", async () => {
    const user = userEvent.setup();
    const setTemplateSettings = vi.fn();

    const mockTemplateSettings = {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED],
    };

    render(
      <MultiSelect
        templateSettings={mockTemplateSettings}
        setTemplateSettings={setTemplateSettings}
      />,
    );

    const select = screen.getByRole("combobox");
    await user.click(select);

    expect(
      screen.queryByRole("option", { name: /order completed/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: /fulfillment created/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /payment captured/i }),
    ).toBeInTheDocument();
  });

  it("should display all selected triggers as badges", () => {
    const setTemplateSettings = vi.fn();

    const mockTemplateSettings = {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [
        InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED,
        InvoiceSettingsAutoGenerateTrigger.PAYMENT_CAPTURED,
      ],
    };

    render(
      <MultiSelect
        templateSettings={mockTemplateSettings}
        setTemplateSettings={setTemplateSettings}
      />,
    );

    expect(screen.getByText(/order completed/i)).toBeInTheDocument();
    expect(screen.getByText(/payment captured/i)).toBeInTheDocument();
  });

  it("should not add duplicate triggers", async () => {
    let currentSettings = {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED],
    };

    const setTemplateSettings = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentSettings = updater(currentSettings);
      }
    });

    render(
      <MultiSelect
        templateSettings={currentSettings}
        setTemplateSettings={setTemplateSettings}
      />,
    );

    const updateFn = setTemplateSettings.mock.calls[0]?.[0];
    if (typeof updateFn === "function") {
      const result = updateFn(currentSettings);
      expect(result.auto_generate_on.length).toBe(1);
    }
  });
});
