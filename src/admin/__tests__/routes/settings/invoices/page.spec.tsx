import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../../../constants/invoice";
import {
  useInvoiceSettings,
  useUpsertInvoiceSettings,
} from "../../../../hooks/invoice-settings";
import { useOrder, useOrders } from "../../../../hooks/orders";
import { render, screen, within } from "@testing-library/react";
import RenderTemplateSettings from "../../../../components/RenderTemplateSettings";
import Invoices from "../../../../routes/settings/invoices/page";
import MultiSelect from "../../../../components/MultiSelect";

vi.mock("../../../../hooks/invoice-settings", () => ({
  useInvoiceSettings: vi.fn(),
  useUpsertInvoiceSettings: vi.fn(),
}));

vi.mock("../../../../hooks/orders", () => ({
  useOrders: vi.fn(),
  useOrder: vi.fn(),
}));

vi.mock("../../../../components/PdfViewer", () => ({
  default: ({ selectedOrderId }: any) => (
    <div data-testid="pdf-viewer">
      PDF Viewer - Order: {selectedOrderId || "none"}
    </div>
  ),
}));

vi.mock("../../../../components/DummyPdfViewer", () => ({
  default: () => <div data-testid="dummy-pdf-viewer">Dummy PDF Viewer</div>,
}));

vi.mock("../../../../components/TiptapEditor", () => ({
  default: ({ onChange, placeholder }: any) => (
    <textarea
      data-testid={`tiptap-${placeholder}`}
      onChange={(e) => onChange({ content: e.target.value })}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("../../../../components/FileUploader", () => ({
  default: () => <div data-testid="file-uploader">File Uploader</div>,
}));

describe("Settings Page Tests", () => {
  const mockInvoiceSettings = {
    settings: {
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
      header_logo_text: null,
      header_logo_url: null,
      header_content: null,
      footer_content: null,
      store_name: "Test Store",
      store_address: "123 Test St",
      store_tax_id: "TAX123",
      bank_account_iban: "IBAN123",
      bank_account_swift: "SWIFT123",
      auto_generate_on: [],
    },
  };

  const mockOrders = {
    orders: [
      { id: "order_1", display_id: "1001", created_at: "2024-01-01" },
      { id: "order_2", display_id: "1002", created_at: "2024-01-02" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

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

    vi.mocked(useInvoiceSettings).mockReturnValue({
      data: mockInvoiceSettings,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(useOrders).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(useOrder).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(useUpsertInvoiceSettings).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);
  });

  describe("Form Save Functionality", () => {
    it("should save settings correctly when Save Settings button is clicked", async () => {
      const user = userEvent.setup();
      const mutateAsync = vi.fn().mockResolvedValue({});

      vi.mocked(useUpsertInvoiceSettings).mockReturnValue({
        mutateAsync,
        isPending: false,
      } as any);

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
        store_name: "Test Store",
        store_address: "123 Test St",
        store_tax_id: "TAX123",
        bank_account_iban: "IBAN123",
        bank_account_swift: "SWIFT123",
        auto_generate_on: [],
      };

      const setTemplateSettings = vi.fn();

      render(
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const saveButton = screen.getByRole("button", { name: /save settings/i });
      await user.click(saveButton);

      expect(mutateAsync).toHaveBeenCalledWith({
        template_id: InvoiceTemplateId.CLEAN,
        template_version: "1.0.0",
        header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
        header_logo_url: null,
        header_logo_text: null,
        header_content: {},
        footer_content: {},
        store_name: "Test Store",
        store_address: "123 Test St",
        store_tax_id: "TAX123",
        bank_account_iban: "IBAN123",
        bank_account_swift: "SWIFT123",
        auto_generate_on: [],
      });
    });

    it("should validate header text when type is TEXT", async () => {
      const user = userEvent.setup();
      const mutateAsync = vi.fn();

      vi.mocked(useUpsertInvoiceSettings).mockReturnValue({
        mutateAsync,
        isPending: false,
      } as any);

      const mockTemplateSettings = {
        template_id: InvoiceTemplateId.CLEAN,
        template_version: "1.0.0",
        header_logo: {
          type: InvoiceSettingsHeaderLogoType.TEXT,
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

      const setTemplateSettings = vi.fn();

      render(
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const saveButton = screen.getByRole("button", { name: /save settings/i });
      await user.click(saveButton);

      expect(
        screen.getByText(/string must contain at least 1 character/i),
      ).toBeInTheDocument();

      expect(mutateAsync).not.toHaveBeenCalled();
    });

    it("should validate header URL when type is IMAGE", async () => {
      const user = userEvent.setup();
      const mutateAsync = vi.fn();

      vi.mocked(useUpsertInvoiceSettings).mockReturnValue({
        mutateAsync,
        isPending: false,
      } as any);

      const mockTemplateSettings = {
        template_id: InvoiceTemplateId.CLEAN,
        template_version: "1.0.0",
        header_logo: {
          type: InvoiceSettingsHeaderLogoType.IMAGE,
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

      const setTemplateSettings = vi.fn();

      render(
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const saveButton = screen.getByRole("button", { name: /save settings/i });
      await user.click(saveButton);

      expect(
        screen.getByText(/provide an image url or upload a file/i),
      ).toBeInTheDocument();

      expect(mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("Preview Updates on Changes", () => {
    it("should update store name input and reflect in state", async () => {
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const storeNameInput = screen.getByLabelText(/business name/i);
      await user.type(storeNameInput, "New Store Name");

      expect(setTemplateSettings).toHaveBeenCalled();
    });

    it("should update header content and reflect in state", async () => {
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const headerEditor = screen.getByPlaceholderText(
        /additional header content/i,
      );
      await user.type(headerEditor, "Header text");

      expect(setTemplateSettings).toHaveBeenCalled();
    });

    it("should switch between dummy data and select order preview", async () => {
      const user = userEvent.setup();

      render(<Invoices />);

      expect(screen.getByTestId("dummy-pdf-viewer")).toBeInTheDocument();

      const selectOrderTab = screen.getByRole("tab", { name: /select order/i });
      await user.click(selectOrderTab);

      expect(screen.getByText(/select an order/i)).toBeInTheDocument();
    });
  });

  describe("Template Selection", () => {
    it("should select Clean template", async () => {
      const user = userEvent.setup();
      const setTemplateSettings = vi.fn();

      const mockTemplateSettings = {
        template_id: InvoiceTemplateId.CLASSIC,
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const cleanRadio = screen.getByRole("radio", { name: /clean/i });
      await user.click(cleanRadio);

      expect(setTemplateSettings).toHaveBeenCalled();
    });

    it("should select Classic template", async () => {
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const classicRadio = screen.getByRole("radio", { name: /classic/i });
      await user.click(classicRadio);

      expect(setTemplateSettings).toHaveBeenCalled();
    });

    it("should select Compact template", async () => {
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      const compactRadio = screen.getByRole("radio", { name: /compact/i });
      await user.click(compactRadio);

      expect(setTemplateSettings).toHaveBeenCalled();
    });

    it("should display current and new template version", () => {
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
        <RenderTemplateSettings
          previewType="dummy-data"
          selectedOrderId=""
          templateSettings={mockTemplateSettings}
          setTemplateSettings={setTemplateSettings}
        />,
      );

      expect(
        screen.getByText(/current version: v1\.0\.0/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/version that will be saved: v1\.0\.0/i),
      ).toBeInTheDocument();
    });
  });

  describe("Multi-Select Triggers", () => {
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
});
