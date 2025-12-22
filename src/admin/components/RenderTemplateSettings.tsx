import { DocumentText as DocumentTextIcon, Spinner } from "@medusajs/icons";
import {
  Button,
  Checkbox,
  Heading,
  Input,
  Label,
  RadioGroup,
  Textarea,
  toast,
} from "@medusajs/ui";
import React from "react";
import TiptapEditor from "./TiptapEditor";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { JSONContent } from "@tiptap/react";
import { useUpsertInvoiceSettings } from "../hooks/invoice-settings";
import { getTemplate } from "./templates/registry";
import { InvoiceSettingsAutoGenerateTrigger } from "../../constants/invoice";

const RenderTemplateSettings: React.FC<{
  previewType: string;
  selectedOrderId: string;
  renderHeading?: boolean;
  templateSettings: TemplateSettings;
  setTemplateSettings: React.Dispatch<React.SetStateAction<TemplateSettings>>;
}> = React.memo(
  ({ renderHeading = true, templateSettings, setTemplateSettings }) => {
    const upsertInvoiceSettings = useUpsertInvoiceSettings();

    const handleSave = async () => {
      const template = getTemplate(templateSettings.template_id);

      const auto_generate_on = [];

      if (templateSettings.order_completed) {
        auto_generate_on.push(
          InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED,
        );
      }

      if (templateSettings.payment_captured) {
        auto_generate_on.push(
          InvoiceSettingsAutoGenerateTrigger.PAYMENT_CAPTURED,
        );
      }

      if (templateSettings.fulfillment_created) {
        auto_generate_on.push(
          InvoiceSettingsAutoGenerateTrigger.FULFILLMENT_CREATED,
        );
      }

      try {
        await upsertInvoiceSettings.mutateAsync({
          template_id: templateSettings.template_id,
          template_version: template.version,
          header_logo_type: templateSettings.header_logo_type,
          header_logo_url: templateSettings.header_logo_url || null,
          header_logo_text: templateSettings.header_logo_text,
          header_content: templateSettings.header_content,
          footer_content: templateSettings.footer_content || null,
          store_name: templateSettings.store_name || null,
          store_address: templateSettings.store_address || null,
          store_tax_id: templateSettings.store_tax_id || null,
          bank_account_iban: templateSettings.bank_account_iban || null,
          bank_account_swift: templateSettings.bank_account_swift || null,
          auto_generate_on: auto_generate_on,
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
        header_logo_type: value as TemplateSettings["header_logo_type"],
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

    const handleTriggerChange = React.useCallback(
      (field: keyof TemplateSettings, checked: boolean) => {
        setTemplateSettings((prev) => ({
          ...prev,
          [field]: checked,
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
              value="clean"
              label="Clean"
              description="A clean template style"
            />
            <RadioGroup.ChoiceBox
              value="classic"
              label="Classic"
              description="A classic template style"
            />
            <RadioGroup.ChoiceBox
              value="compact"
              label="Compact"
              description="A compact template style"
            />
          </RadioGroup>
        </div>
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">
            Header / Logo
          </Heading>
          <RadioGroup
            value={templateSettings.header_logo_type}
            className="flex gap-3 justify-between flex-wrap"
            onValueChange={handleHeaderLogoTypeChange}
          >
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="image" id="image" />
              <Label htmlFor="image">Image</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="text" id="heading" />
              <Label htmlFor="heading">Heading</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>
          {templateSettings.header_logo_type === "image" && (
            <div className="mt-3">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                id="image-url"
                className="mt-1"
                value={templateSettings.header_logo_url}
                onChange={(e) =>
                  handleInputChange("header_logo_url", e.target.value)
                }
              />
            </div>
          )}
          {templateSettings.header_logo_type === "text" && (
            <div className="mt-3">
              <Label htmlFor="header-text">Header Text</Label>
              <Input
                placeholder="My Company"
                id="header-text"
                className="mt-1"
                value={templateSettings.header_logo_text}
                onChange={(e) =>
                  handleInputChange("header_logo_text", e.target.value)
                }
              />
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
          <div className="flex items-center gap-x-1.5 mb-3">
            <Checkbox
              id="order-completed"
              checked={templateSettings.order_completed}
              onCheckedChange={(checked) =>
                handleTriggerChange("order_completed", !!checked)
              }
            />
            <Label htmlFor="order-completed">Order Completed</Label>
          </div>
          <div className="flex items-center gap-x-1.5 mb-3">
            <Checkbox
              id="payment-captured"
              checked={templateSettings.payment_captured}
              onCheckedChange={(checked) =>
                handleTriggerChange("payment_captured", !!checked)
              }
            />
            <Label htmlFor="payment-captured">Payment Captured</Label>
          </div>
          <div className="flex items-center gap-x-1.5">
            <Checkbox
              id="fulfillment-created"
              checked={templateSettings.fulfillment_created}
              onCheckedChange={(checked) =>
                handleTriggerChange("fulfillment_created", !!checked)
              }
            />
            <Label htmlFor="fulfillment-created">Fulfillment Created</Label>
          </div>
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
