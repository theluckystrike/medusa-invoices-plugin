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
      try {
        await upsertInvoiceSettings.mutateAsync({
          style: templateSettings.style,
          header_type: templateSettings.headerType,
          image_url: templateSettings.imageUrl,
          header_text: templateSettings.headerText,
          additional_header_content: templateSettings.additionalHeaderContent,
          additional_footer_content: templateSettings.additionalFooterContent,
          business: templateSettings.business,
          auto_order_completed: templateSettings.orderCompleted,
          auto_payment_captured: templateSettings.paymentCaptured,
          auto_fullfillment_created: templateSettings.fulfillmentCreated,
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

    const handleStyleChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        style: value as TemplateSettings["style"],
      }));
    }, []);

    const handleHeaderTypeChange = React.useCallback((value: string) => {
      setTemplateSettings((prev) => ({
        ...prev,
        headerType: value as TemplateSettings["headerType"],
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

    const handleBusinessChange = React.useCallback(
      (field: keyof TemplateSettings["business"], value: string) => {
        setTemplateSettings((prev) => ({
          ...prev,
          business: { ...prev.business, [field]: value },
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
            value={templateSettings.style}
            onValueChange={handleStyleChange}
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
            value={templateSettings.headerType}
            className="flex gap-3 justify-between flex-wrap"
            onValueChange={handleHeaderTypeChange}
          >
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="image" id="image" />
              <Label htmlFor="image">Image</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="heading" id="heading" />
              <Label htmlFor="heading">Heading</Label>
            </div>
            <div className="flex items-center gap-x-1.5">
              <RadioGroup.Item value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>
          {templateSettings.headerType === "image" && (
            <div className="mt-3">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                id="image-url"
                className="mt-1"
                value={templateSettings.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              />
            </div>
          )}
          {templateSettings.headerType === "heading" && (
            <div className="mt-3">
              <Label htmlFor="header-text">Header Text</Label>
              <Input
                placeholder="My Company"
                id="header-text"
                className="mt-1"
                value={templateSettings.headerText}
                onChange={(e) =>
                  handleInputChange("headerText", e.target.value)
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
            initialContent={templateSettings.additionalHeaderContent}
            onChange={(value) =>
              handleAdditionalContentChange("additionalHeaderContent", value)
            }
            placeholder="Additional header content"
            className="mb-3 mt-1"
          />
          <Label>Footer Content</Label>
          <TiptapEditor
            initialContent={templateSettings.additionalFooterContent}
            onChange={(value) =>
              handleAdditionalContentChange("additionalFooterContent", value)
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
            value={templateSettings.business.name}
            onChange={(e) => handleBusinessChange("name", e.target.value)}
          />
          <Label htmlFor="address">Address</Label>
          <Textarea
            placeholder="Business address"
            id="address"
            className="mt-1 mb-3"
            style={{ maxHeight: "8rem" }}
            maxLength={200}
            value={templateSettings.business.address}
            onChange={(e) => handleBusinessChange("address", e.target.value)}
          />
          <Label htmlFor="tax-id">Tax / VAT ID</Label>
          <Input
            placeholder="Tax identification number"
            id="tax-id"
            className="mt-1 mb-4"
            value={templateSettings.business.tax_id}
            onChange={(e) => handleBusinessChange("tax_id", e.target.value)}
          />
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                placeholder="International Bank Account Number"
                id="iban"
                className="mt-1"
                value={templateSettings.business.iban}
                onChange={(e) => handleBusinessChange("iban", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="swift">SWIFT</Label>
              <Input
                placeholder="SWIFT/BIC code"
                id="swift"
                className="mt-1"
                value={templateSettings.business.swift}
                onChange={(e) => handleBusinessChange("swift", e.target.value)}
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
              checked={templateSettings.orderCompleted}
              onCheckedChange={(checked) =>
                handleTriggerChange("orderCompleted", !!checked)
              }
            />
            <Label htmlFor="order-completed">Order Completed</Label>
          </div>
          <div className="flex items-center gap-x-1.5 mb-3">
            <Checkbox
              id="payment-captured"
              checked={templateSettings.paymentCaptured}
              onCheckedChange={(checked) =>
                handleTriggerChange("paymentCaptured", !!checked)
              }
            />
            <Label htmlFor="payment-captured">Payment Captured</Label>
          </div>
          <div className="flex items-center gap-x-1.5">
            <Checkbox
              id="fulfillment-created"
              checked={templateSettings.fulfillmentCreated}
              onCheckedChange={(checked) =>
                handleTriggerChange("fulfillmentCreated", !!checked)
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
