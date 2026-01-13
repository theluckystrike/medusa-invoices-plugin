import {
  DocumentText as DocumentTextIcon,
  ExclamationCircleSolid,
  Spinner,
} from "@medusajs/icons";
import {
  Button,
  Heading,
  Input,
  Label,
  RadioGroup,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui";
import React from "react";
import TiptapEditor from "./TiptapEditor";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { JSONContent } from "@tiptap/react";
import { useUpsertInvoiceSettings } from "../hooks/invoice-settings";
import { getTemplate, templates } from "./templates/registry";
import FileUploader from "./FileUploader";
import MultiSelect from "./MultiSelect";
import {
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../constants/invoice";
import { sdk } from "../lib/sdk";

const RenderTemplateSettings: React.FC<{
  previewType: string;
  selectedOrderId: string;
  renderHeading?: boolean;
  templateSettings: TemplateSettings;
  setTemplateSettings: React.Dispatch<React.SetStateAction<TemplateSettings>>;
}> = React.memo(
  ({ renderHeading = true, templateSettings, setTemplateSettings }) => {
    const [headerLogoFile, setHeaderLogoFile] = React.useState<File | null>(
      null,
    );
    const [headerTextError, setHeaderTextError] = React.useState<string | null>(
      null,
    );
    const [headerUrlError, setHeaderUrlError] = React.useState<string | null>(
      null,
    );

    const upsertInvoiceSettings = useUpsertInvoiceSettings();

    const handleSave = async () => {
      const template = getTemplate(templateSettings.template_id);

      if (
        templateSettings.header_logo.type ===
          InvoiceSettingsHeaderLogoType.TEXT &&
        !templateSettings.header_logo.text?.trim()
      ) {
        setHeaderTextError("String must contain at least 1 character(s)");
        return;
      } else if (
        templateSettings.header_logo.type ===
          InvoiceSettingsHeaderLogoType.IMAGE &&
        !templateSettings.header_logo.url?.trim()
      ) {
        setHeaderUrlError("Provide an image URL or upload a file");
        return;
      } else {
        setHeaderTextError(null);
        setHeaderUrlError(null);
      }

      try {
        let uploadedUrl: string | null = null;

        if (templateSettings.header_logo.type === "image") {
          uploadedUrl = templateSettings.header_logo.url || null;

          if (headerLogoFile) {
            try {
              const { files } = await sdk.admin.upload.create({
                files: [headerLogoFile],
              });

              if (!files?.length || !files[0]?.url) {
                throw new Error("Upload did not return a file URL");
              }

              uploadedUrl = files[0].url;
            } catch (uploadError) {
              throw new Error("Header logo upload failed. Please try again.");
            }
          }
        }

        await upsertInvoiceSettings.mutateAsync({
          template_id: templateSettings.template_id,
          template_version: template.version,
          header_logo_type: templateSettings.header_logo.type,
          header_logo_url:
            templateSettings.header_logo.type === "image" ? uploadedUrl : null,
          header_logo_text:
            templateSettings.header_logo.type === "text"
              ? templateSettings.header_logo.text || null
              : null,
          header_content: templateSettings.header_content || null,
          footer_content: templateSettings.footer_content || null,
          store_name: templateSettings.store_name || null,
          store_address: templateSettings.store_address || null,
          store_tax_id: templateSettings.store_tax_id || null,
          bank_account_iban: templateSettings.bank_account_iban || null,
          bank_account_swift: templateSettings.bank_account_swift || null,
          auto_generate_on: templateSettings.auto_generate_on,
        });

        toast.success("Updated invoice settings", {
          description: "Invoice settings updated successfully",
        });
      } catch (error: any) {
        toast.error("Invoice settings not updated", {
          description: error.message || "Failed to update invoice settings",
        });
      }
    };

    const handleTemplateIdChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        template_id: value as TemplateSettings["template_id"],
      }));
    }, []);

    const handleHeaderLogoTypeChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        header_logo: {
          ...prev.header_logo,
          type: value as TemplateSettings["header_logo"]["type"],
        },
      }));
      setHeaderTextError(null);
      setHeaderUrlError(null);
    }, []);

    const handleHeaderLogoUrlChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        header_logo: {
          ...prev.header_logo,
          url: value,
        },
      }));
    }, []);

    const handleHeaderLogoTextChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        header_logo: {
          ...prev.header_logo,
          text: value,
        },
      }));
    }, []);

    const handleInputChange = React.useCallback(
      (field: keyof TemplateSettings, value: string) => {
        setTemplateSettings((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      [],
    );

    const handleAdditionalContentChange = React.useCallback(
      (field: keyof TemplateSettings, value: JSONContent) => {
        setTemplateSettings((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      [],
    );

    return (
      <>
        <div className="px-6 py-4">
          {renderHeading && (
            <Heading level="h2" className="mb-4">
              Template Settings
            </Heading>
          )}
          <Label htmlFor="template-style">Style</Label>
          <RadioGroup
            id="template-style"
            className="mt-1"
            value={templateSettings.template_id}
            onValueChange={handleTemplateIdChange}
          >
            <RadioGroup.ChoiceBox
              value={InvoiceTemplateId.CLEAN}
              label={`Clean (v${templates.clean.version})`}
              description="A clean template style"
            />
            <RadioGroup.ChoiceBox
              value={InvoiceTemplateId.CLASSIC}
              label={`Classic (v${templates.classic.version})`}
              description="A classic template style"
            />
            <RadioGroup.ChoiceBox
              value={InvoiceTemplateId.COMPACT}
              label={`Compact (v${templates.compact.version})`}
              description="A compact template style"
            />
          </RadioGroup>

          <Text className="mt-2 text-center text-ui-fg-subtle" size="xsmall">
            Current version: v{templateSettings.template_version}
          </Text>

          <Text className="text-center text-ui-fg-subtle" size="xsmall">
            Version that will be saved: v
            {getTemplate(templateSettings.template_id).version}
          </Text>
        </div>
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">
            Header / Logo
          </Heading>
          <RadioGroup
            value={templateSettings.header_logo.type}
            className="flex gap-3 justify-between flex-wrap"
            onValueChange={handleHeaderLogoTypeChange}
          >
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item
                value={InvoiceSettingsHeaderLogoType.NONE}
                id="none"
              />
              <Label htmlFor="none">None</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item
                value={InvoiceSettingsHeaderLogoType.TEXT}
                id="text"
              />
              <Label htmlFor="text">Text</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item
                value={InvoiceSettingsHeaderLogoType.IMAGE}
                id="image"
              />
              <Label htmlFor="image">Image</Label>
            </div>
          </RadioGroup>
          {templateSettings.header_logo.type === "image" && (
            <div className="mt-3">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                id="image-url"
                className="mt-1"
                value={templateSettings.header_logo.url}
                onChange={(e) => handleHeaderLogoUrlChange(e.target.value)}
              />

              <FileUploader
                templateSettings={templateSettings}
                setTemplateSettings={setTemplateSettings}
                headerLogoFile={headerLogoFile}
                setHeaderLogoFile={setHeaderLogoFile}
              />

              {headerUrlError && (
                <Text className="flex items-center gap-1 mt-1 text-red-500">
                  <ExclamationCircleSolid /> {headerUrlError}
                </Text>
              )}
            </div>
          )}
          {templateSettings.header_logo.type === "text" && (
            <div className="mt-3">
              <Label htmlFor="header-text">Header Text</Label>
              <Input
                placeholder="My Company"
                id="header-text"
                className="mt-1"
                value={templateSettings.header_logo.text}
                onChange={(e) => handleHeaderLogoTextChange(e.target.value)}
              />

              {headerTextError && (
                <Text className="flex items-center gap-1 mt-1 text-red-500">
                  <ExclamationCircleSolid /> {headerTextError}
                </Text>
              )}
            </div>
          )}
        </div>
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">
            Additional Content
          </Heading>
          <Label>Header Content</Label>
          <TiptapEditor
            initialContent={templateSettings.header_content}
            onChange={(value) =>
              handleAdditionalContentChange("header_content", value)
            }
            placeholder="Additional header content"
            className="mb-3 mt-1"
          />
          <Label>Footer Content</Label>
          <TiptapEditor
            initialContent={templateSettings.footer_content}
            onChange={(value) =>
              handleAdditionalContentChange("footer_content", value)
            }
            placeholder="Additional footer content"
            className="mt-1 max-h-40"
          />
        </div>
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">
            Business Information
          </Heading>
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            placeholder="My Company"
            id="business-name"
            className="mt-1 mb-3"
            value={templateSettings.store_name}
            onChange={(e) => handleInputChange("store_name", e.target.value)}
          />
          <Label htmlFor="address">Address</Label>
          <Textarea
            placeholder="Business address"
            id="address"
            className="mt-1 mb-3"
            style={{ maxHeight: "8rem" }}
            maxLength={200}
            value={templateSettings.store_address}
            onChange={(e) => handleInputChange("store_address", e.target.value)}
          />
          <Label htmlFor="tax-id">Tax / VAT ID</Label>
          <Input
            placeholder="Tax identification number"
            id="tax-id"
            className="mt-1 mb-4"
            value={templateSettings.store_tax_id}
            onChange={(e) => handleInputChange("store_tax_id", e.target.value)}
          />
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                placeholder="International Bank Account Number"
                id="iban"
                className="mt-1"
                value={templateSettings.bank_account_iban}
                onChange={(e) =>
                  handleInputChange("bank_account_iban", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="swift">SWIFT</Label>
              <Input
                placeholder="SWIFT/BIC code"
                id="swift"
                className="mt-1"
                value={templateSettings.bank_account_swift}
                onChange={(e) =>
                  handleInputChange("bank_account_swift", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">
            Auto-generation Triggers
          </Heading>

          <MultiSelect
            templateSettings={templateSettings}
            setTemplateSettings={setTemplateSettings}
          />
        </div>
        <div className="px-6 py-4 sticky bottom-0 bg-ui-bg-base">
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={upsertInvoiceSettings.isPending}
          >
            {upsertInvoiceSettings.isPending ? (
              <Spinner />
            ) : (
              <>
                <DocumentTextIcon />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </>
    );
  },
);

export default RenderTemplateSettings;
