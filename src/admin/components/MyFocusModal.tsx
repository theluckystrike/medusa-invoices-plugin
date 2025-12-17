import { Button, FocusModal, Text } from "@medusajs/ui";
import { Dispatch, SetStateAction } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "./InvoicePdfDocument";
import { useInvoiceSettings } from "../hooks/invoice-settings";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { useOrder } from "../hooks/orders";
import { AdminOrder } from "@medusajs/framework/types";
import { AdminInvoice } from "../hooks/invoices";
import { ArrowDownTray } from "@medusajs/icons";

type MyFocusModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  orderId: string;
};

export type AdminOrderWithInvoices = AdminOrder & { invoices?: AdminInvoice[] };

const MyFocusModal = ({
  isModalOpen,
  setIsModalOpen,
  orderId,
}: MyFocusModalProps) => {
  const invoiceSettingsQuery = useInvoiceSettings();
  const orderQuery = useOrder(
    orderId,
    {
      fields:
        "id,status,created_at,canceled_at,email,display_id,currency_code,metadata,total,credit_line_total,item_subtotal,item_total,item_tax_total,original_item_tax_total,item_discount_total,shipping_subtotal,original_total,original_tax_total,subtotal,discount_total,discount_subtotal,shipping_total,shipping_tax_total,original_shipping_tax_total,shipping_discount_total,tax_total,refundable_total,order_change,*customer,*items,*items.variant,*items.variant.product,*items.variant.options,+items.variant.manage_inventory,*items.variant.inventory_items.inventory,+items.variant.inventory_items.required_quantity,+summary,*shipping_address,*billing_address,*sales_channel,*promotions,*shipping_methods,*credit_lines,*fulfillments,+fulfillments.shipping_option.service_zone.fulfillment_set.type,*fulfillments.items,*fulfillments.labels,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.refunds,*payment_collections.payments.refunds.refund_reason,region.automatic_taxes,invoices.*",
    },
    { enabled: !!orderId },
  );

  if (
    invoiceSettingsQuery.isLoading ||
    invoiceSettingsQuery.isError ||
    !invoiceSettingsQuery.data
  ) {
    return (
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>Invoice Preview</FocusModal.Title>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <Text>
              {invoiceSettingsQuery.isError
                ? "Failed to fetch data."
                : "Loading preview..."}
            </Text>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    );
  }

  const templateSettings: TemplateSettings = {
    style: invoiceSettingsQuery.data?.style,
    headerType: invoiceSettingsQuery.data?.header_type,
    imageUrl: invoiceSettingsQuery.data?.image_url ?? "",
    headerText: invoiceSettingsQuery.data?.header_text ?? "",
    additionalHeaderContent:
      invoiceSettingsQuery.data?.additional_header_content ?? {},
    additionalFooterContent:
      invoiceSettingsQuery.data?.additional_footer_content ?? {},
    business: {
      name: invoiceSettingsQuery.data?.business.name ?? "",
      address: invoiceSettingsQuery.data?.business.address ?? "",
      tax_id: invoiceSettingsQuery.data?.business.tax_id ?? "",
      iban: invoiceSettingsQuery.data?.business.iban ?? "",
      swift: invoiceSettingsQuery.data?.business.swift ?? "",
    },
    orderCompleted: invoiceSettingsQuery.data?.auto_order_completed,
    paymentCaptured: invoiceSettingsQuery.data?.auto_payment_captured,
    fulfillmentCreated: invoiceSettingsQuery.data?.auto_fullfillment_created,
  };

  const orderWithInvoices = orderQuery.data?.order as
    | AdminOrderWithInvoices
    | undefined;

  return (
    <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Invoice Preview</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <PDFViewer showToolbar={false} height="100%" width="100%">
            <InvoicePdfDocument
              templateSettings={templateSettings}
              order={orderWithInvoices}
            />
          </PDFViewer>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button>
            <ArrowDownTray className="text-ui-fg-subtle" />
            Download
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default MyFocusModal;
