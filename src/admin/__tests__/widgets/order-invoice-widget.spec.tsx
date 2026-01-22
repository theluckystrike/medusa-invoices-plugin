import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  InvoiceCreatedByEvent,
  InvoiceStatus,
  InvoiceTemplateId,
} from "../../../constants/invoice";
import {
  useGenerateInvoice,
  useOrderInvoice,
  useOrderInvoices,
} from "../../hooks/invoices";

import { AdminOrder } from "@medusajs/framework/types";
import OrderInvoiceWidget from "../../widgets/order-invoice-widget";

vi.mock("../../hooks/invoices");
describe("OrderInvoiceWidget", () => {
  const mockOrderData = {
    id: "order_123",
    version: 2,
    region_id: null,
    customer_id: null,
    sales_channel_id: null,
    email: null,
    currency_code: "eur",
    display_id: 1,
    status: "completed",
    payment_status: "not_paid",
    fulfillment_status: "not_fulfilled",
    summary: {
      pending_difference: 10,
      current_order_total: 10,
      original_order_total: 10,
      transaction_total: 10,
      paid_total: 10,
      refunded_total: 10,
      accounting_total: 10,
    },
    created_at: "2025-12-01T10:45:15.629Z",
    updated_at: "2025-12-01T10:45:15.629Z",
    original_item_total: 10,
    original_item_subtotal: 10,
    original_item_tax_total: 10,
    item_total: 10,
    item_subtotal: 10,
    item_tax_total: 10,
    item_discount_total: 10,
    original_total: 10,
    original_subtotal: 10,
    original_tax_total: 10,
    total: 10,
    subtotal: 10,
    tax_total: 10,
    discount_total: 10,
    discount_tax_total: 10,
    gift_card_total: 10,
    gift_card_tax_total: 10,
    shipping_total: 10,
    shipping_subtotal: 10,
    shipping_tax_total: 10,
    shipping_discount_total: 10,
    original_shipping_total: 10,
    original_shipping_subtotal: 10,
    original_shipping_tax_total: 10,
    credit_line_total: 10,
    payment_collections: [],
    items: [],
    shipping_methods: [],
  };

  const mockInvoiceData = {
    order_display_id: 1,
    status: InvoiceStatus.COMPLETED,
    completed_at: "2026-01-21T14:03:13.728Z",
    pdf_url: "https://example.com/invoice.pdf",
    template_id: InvoiceTemplateId.CLASSIC,
    template_version: "1.0.0",
    error_message: null,
    created_by_event: InvoiceCreatedByEvent.MANUAL,
    created_at: "2026-01-21T14:03:13.442Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Status Badge Display", () => {
    it("should display 'Queued' status when no invoice exists", () => {
      vi.mocked(useOrderInvoice).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      vi.mocked(useGenerateInvoice).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
      } as any);

      render(<OrderInvoiceWidget data={mockOrderData as AdminOrder} />);
    });

    it("should display 'Generating' status during invoice generation", () => {
      vi.mocked(useOrderInvoice).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      vi.mocked(useGenerateInvoice).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: true,
        isError: false,
      } as any);

      render(<OrderInvoiceWidget data={mockOrderData as AdminOrder} />);

      expect(screen.getByText("Generating")).toBeInTheDocument();
    });

    it("should display 'Completed' status when invoice is completed", () => {
      vi.mocked(useOrderInvoice).mockReturnValue({
        data: mockInvoiceData,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      vi.mocked(useGenerateInvoice).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
      } as any);

      vi.mocked(useOrderInvoices).mockReturnValue({
        data: [],
        isLoading: false,
        refetch: vi.fn(),
      } as any);

      render(<OrderInvoiceWidget data={mockOrderData as AdminOrder} />);

      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("should display 'Failed' status when generation fails", () => {
      vi.mocked(useOrderInvoice).mockReturnValue({
        data: {
          ...mockInvoiceData,
          status: InvoiceStatus.FAILED,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      vi.mocked(useGenerateInvoice).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
      } as any);

      render(<OrderInvoiceWidget data={mockOrderData as AdminOrder} />);

      expect(screen.getByText("Failed")).toBeInTheDocument();
    });

    it("should display 'Failed' status when mutation errors", () => {
      vi.mocked(useOrderInvoice).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      vi.mocked(useGenerateInvoice).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
        isError: true,
      } as any);

      render(<OrderInvoiceWidget data={mockOrderData as AdminOrder} />);

      expect(screen.getByText("Failed")).toBeInTheDocument();
    });
  });
});
