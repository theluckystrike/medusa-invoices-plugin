import * as React from "react";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { invoiceDummyData, orderDummyData } from "./templateDummyData";
import { TemplateProps } from "../templates/types";
import PdfPreview from "./PdfPreview";

type DummyPdfViewerProps = {
  templateSettings: Omit<TemplateSettings, "auto_generate_on">;
};

const DummyPdfViewer: React.FC<DummyPdfViewerProps> = ({ templateSettings }) => {
  const templateProps: TemplateProps = {
    order: orderDummyData,
    settings: templateSettings,
    invoice: invoiceDummyData,
  };

  return <PdfPreview templateId={templateSettings.template_id} templateProps={templateProps} />;
};

export default DummyPdfViewer;
