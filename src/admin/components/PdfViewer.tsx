import * as React from "react";
import { Text } from "@medusajs/ui";
import { AdminOrderResponse } from "@medusajs/framework/types";
import { UseQueryResult } from "@tanstack/react-query";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { TemplateProps } from "../templates/types";
import PdfPreview from "./PdfPreview";

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

  const templateProps: TemplateProps = {
    order,
    settings: templateSettings,
    invoice: {
      id: `invoice-${order.id}`,
      created_at: order.created_at,
      display_number: order.display_id,
    },
  };

  return (
    <PdfPreview
      templateId={templateSettings.template_id}
      templateProps={templateProps}
    />
  );
};

export default PdfViewer;
