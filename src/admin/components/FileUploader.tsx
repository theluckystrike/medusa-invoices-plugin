import React from "react";
import { sdk } from "../lib/sdk";
import { Button, toast } from "@medusajs/ui";
import { TemplateSettings } from "../routes/settings/invoices/page";

type FileUploaderProps = {
  setTemplateSettings: React.Dispatch<React.SetStateAction<TemplateSettings>>;
};

const FileUploader = ({ setTemplateSettings }: FileUploaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { files } = await sdk.admin.upload.create({
        files: [file],
      });

      const uploadedUrl = files[0].url;
      toast.success(`Uploaded successfully: ${uploadedUrl}`);
      setTemplateSettings((prev) => ({
        ...prev,
        header_logo: {
          ...prev.header_logo,
          url: uploadedUrl,
        },
      }));
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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

      <Button
        variant="secondary"
        isLoading={isUploading}
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? "Uplaoding image..." : "Upload Image"}
      </Button>
    </div>
  );
};

export default FileUploader;
