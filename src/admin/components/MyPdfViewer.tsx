import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { useOrder } from "../hooks/orders";
import { InvoicePdfDocument } from "./InvoicePdfDocument";
import { getTemplate } from "./templates/registry";

type MyPdfViewerProps = {
  templateSettings: TemplateSettings;
  previewType: "dummy-data" | "select-order";
  selectedOrderId: string;
};

const MyPdfViewer: React.FC<MyPdfViewerProps> = ({
  templateSettings,
  previewType,
  selectedOrderId,
}) => {
  const orderQuery = useOrder(
    selectedOrderId,
    {
      fields:
        "id,status,created_at,canceled_at,email,display_id,currency_code,metadata,total,credit_line_total,item_subtotal,item_total,item_tax_total,original_item_tax_total,item_discount_total,shipping_subtotal,original_total,original_tax_total,subtotal,discount_total,discount_subtotal,shipping_total,shipping_tax_total,original_shipping_tax_total,shipping_discount_total,tax_total,refundable_total,order_change,*customer,*items,*items.variant,*items.variant.product,*items.variant.options,+items.variant.manage_inventory,*items.variant.inventory_items.inventory,+items.variant.inventory_items.required_quantity,+summary,*shipping_address,*billing_address,*sales_channel,*promotions,*shipping_methods,*credit_lines,*fulfillments,+fulfillments.shipping_option.service_zone.fulfillment_set.type,*fulfillments.items,*fulfillments.labels,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.refunds,*payment_collections.payments.refunds.refund_reason,region.automatic_taxes,",
    },
    {
      enabled: !!selectedOrderId,
    },
  );

  const order = orderQuery.data?.order;

  if (previewType === "select-order" && !selectedOrderId) {
    return <div>Please select an order to preview the invoice.</div>;
  }

  if (
    previewType === "select-order" &&
    selectedOrderId &&
    orderQuery.isLoading
  ) {
    return <div>Loading order invoice preview...</div>;
  }

  if (selectedOrderId && orderQuery.isError) {
    return <div>Failed to load order data</div>;
  }

  const template = getTemplate(templateSettings.template_id);
  const TemplateComponent = template.Component;

  return (
    <PDFViewer showToolbar={false} height="100%" width="100%">
      <TemplateComponent settings={templateSettings} order={order} />
      {/*<InvoicePdfDocument templateSettings={templateSettings} order={order} />*/}
    </PDFViewer>
  );
};

export default MyPdfViewer;
