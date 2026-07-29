import React from "react";
import { PDFViewer as ReactPDFViewer } from "@react-pdf/renderer";
import { Text } from "@medusajs/ui";
import type { TemplateProps } from "../../templates/types";
import { useTemplateComponent } from "../hooks/useTemplateComponent";

type PdfPreviewProps = {
  templateId: "clean" | "classic" | "compact";
  templateProps: TemplateProps;
};

const PdfPreview: React.FC<PdfPreviewProps> = ({ templateId, templateProps }) => {
  const templateQuery = useTemplateComponent(templateId, templateProps);

  if (templateQuery.isLoading) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Loading preview...
      </Text>
    );
  }

  if (templateQuery.isError) {
    return (
      <Text className="text-ui-fg-subtle" size="small">
        Failed to load preview
      </Text>
    );
  }

  return (
    <ReactPDFViewer showToolbar={false} height="100%" width="100%">
      {templateQuery.data}
    </ReactPDFViewer>
  );
};

export default PdfPreview;
