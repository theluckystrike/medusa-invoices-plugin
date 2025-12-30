import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { TemplateSettings } from "../routes/settings/invoices/page";
//import { InvoicePdfDocument } from "./InvoicePdfDocument";
import { getTemplate } from "./templates/registry";
import { Text } from "@medusajs/ui";
import { UseQueryResult } from "@tanstack/react-query";
import { AdminOrderResponse } from "@medusajs/framework/types";

type MyPdfViewerProps = {
  templateSettings: TemplateSettings;
  previewType: "dummy-data" | "select-order";
  selectedOrderId: string;
  orderQuery: UseQueryResult<AdminOrderResponse>;
};

const MyPdfViewer: React.FC<MyPdfViewerProps> = ({
  templateSettings,
  previewType,
  selectedOrderId,
  orderQuery,
}) => {
  const order = orderQuery.data?.order;

  if (previewType === "select-order" && !selectedOrderId) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Please select an order to preview the invoice.
      </Text>
    );
  }

  if (
    previewType === "select-order" &&
    selectedOrderId &&
    orderQuery.isLoading
  ) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Loading order invoice preview...
      </Text>
    );
  }

  if (selectedOrderId && orderQuery.isError) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Failed to load order data
      </Text>
    );
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
