import * as React from "react";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";
import { Text } from "@medusajs/ui";
import { AdminOrderResponse } from "@medusajs/framework/types";
import { UseQueryResult } from "@tanstack/react-query";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { useTemplateComponent } from "../hooks/useTemplateComponent";

type PdfViewerProps = {
  templateSettings: TemplateSettings;
  selectedOrderId: string;
  orderQuery: UseQueryResult<AdminOrderResponse>;
};

const PdfViewer: React.FC<PdfViewerProps> = ({
  templateSettings,
  selectedOrderId,
  orderQuery,
}) => {
  const order = orderQuery.data?.order;

  if (!selectedOrderId) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Please select an order to preview the invoice.
      </Text>
    );
  }

  if (selectedOrderId && orderQuery.isLoading) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Loading selected order data...
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

  if (!order) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Failed to load order data
      </Text>
    );
  }

  const invoice = {
    id: "inv_01",
    created_at: order.created_at,
    display_number: order.display_id,
  };

  const templateComponentQuery = useTemplateComponent(
    templateSettings.template_id,
    { order, settings: templateSettings, invoice },
  );
  const templateComponent = templateComponentQuery.data;

  if (templateComponentQuery.isLoading) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Loading order invoice preview...
      </Text>
    );
  }

  if (!templateComponent || templateComponentQuery.isError) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Failed to load order invoice preview
      </Text>
    );
  }

  return (
    <ReactPDFViewer showToolbar={false} height={600} width="100%">
      {templateComponent}
    </ReactPDFViewer>
  );
};

export default PdfViewer;
