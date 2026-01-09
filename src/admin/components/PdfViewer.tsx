import * as React from "react";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";
import { Text } from "@medusajs/ui";
import { AdminOrderResponse } from "@medusajs/framework/types";
import { UseQueryResult } from "@tanstack/react-query";

import { TemplateSettings } from "../routes/settings/invoices/page";
import { getTemplate } from "./templates/registry";
import { useTemplateComponent } from "../hooks/useTemplateComponent";

type PdfViewerProps = {
  templateSettings: TemplateSettings;
  previewType: "dummy-data" | "select-order";
  selectedOrderId: string;
  orderQuery: UseQueryResult<AdminOrderResponse>;
};

const PdfViewer: React.FC<PdfViewerProps> = ({
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

  // const templateComponentQuery = useTemplateComponent(
  //   templateSettings.template_id,
  //   { order, settings: templateSettings },
  // );

  const template = getTemplate(templateSettings.template_id);
  const TemplateComponent = template.Component;

  return (
    <ReactPDFViewer showToolbar={false} height={600} width="100%">
      <TemplateComponent settings={templateSettings} order={order} />
    </ReactPDFViewer>
  );
};

export default PdfViewer;
