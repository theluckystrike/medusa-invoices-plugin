import * as React from "react";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { useTemplateComponent } from "../hooks/useTemplateComponent";
import { invoiceDummyData, orderDummyData } from "./templateDummyData";
import { Text } from "@medusajs/ui";

type DummyPdfViewerProps = {
  templateSettings: TemplateSettings;
};

const DummyPdfViewer: React.FC<DummyPdfViewerProps> = ({
  templateSettings,
}) => {
  const order = orderDummyData;
  const invoice = invoiceDummyData;

  const templateComponentQuery = useTemplateComponent(
    templateSettings.template_id,
    { order, settings: templateSettings, invoice },
  );
  const templateComponent = templateComponentQuery.data;

  if (templateComponentQuery.isLoading) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Loading dummy preview...
      </Text>
    );
  }

  if (!templateComponent || templateComponentQuery.isError) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Failed to load dummy preview
      </Text>
    );
  }

  return (
    <ReactPDFViewer showToolbar={false} height={600} width="100%">
      {templateComponent}
    </ReactPDFViewer>
  );
};

export default DummyPdfViewer;
