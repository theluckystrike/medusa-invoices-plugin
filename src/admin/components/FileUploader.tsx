import React from "react";
import { Button } from "@medusajs/ui";
import { TemplateSettings } from "../routes/settings/invoices/page";

type FileUploaderProps = {
  headerLogoFile: File | null;
  setHeaderLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  templateSettings: TemplateSettings;
  setTemplateSettings: React.Dispatch<React.SetStateAction<TemplateSettings>>;
};

const FileUploader = ({
  setTemplateSettings,
  setHeaderLogoFile,
}: FileUploaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeaderLogoFile(file);

    const previewUrl = URL.createObjectURL(file);

    setTemplateSettings((prev) => ({
      ...prev,
      header_logo: {
        ...prev.header_logo,
        url: previewUrl,
      },
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        hidden
      />

      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        Choose Image
      </Button>
    </div>
  );
};

export default FileUploader;
