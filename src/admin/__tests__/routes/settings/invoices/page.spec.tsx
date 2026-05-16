import { render, screen } from "@testing-library/react";
import Invoices from "../../../../routes/settings/invoices/page";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  useInvoiceSettings,
  useUpsertInvoiceSettings,
} from "../../../../hooks/invoice-settings";
import { useOrder, useOrders } from "../../../../hooks/orders";
import {
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../../../constants/invoice";

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useNavigate: () => vi.fn(),
}));

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

describe("Preview Type Changes", () => {
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

  it("should switch between dummy data and select order preview", async () => {
    const user = userEvent.setup();

    render(<Invoices />);

    expect(screen.getByTestId("dummy-pdf-viewer")).toBeInTheDocument();

    const selectOrderTab = screen.getByRole("tab", { name: /select order/i });
    await user.click(selectOrderTab);

    expect(screen.getByText(/select an order/i)).toBeInTheDocument();
  });
});
