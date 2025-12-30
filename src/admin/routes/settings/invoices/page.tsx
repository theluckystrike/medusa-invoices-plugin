import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  ArrowDownTray as ArrowDownTrayIcon,
  DocumentText as DocumentTextIcon,
  SidebarRight as SidebarRightIcon,
} from "@medusajs/icons";
import {
  Button,
  Container,
  Drawer,
  Heading,
  Label,
  Select,
  Tabs,
  Text,
  toast,
} from "@medusajs/ui";
import React from "react";
import { useOrder, useOrders } from "../../../hooks/orders";
import { JSONContent } from "@tiptap/react";
import RenderTemplateSettings from "../../../components/RenderTemplateSettings";
import { useInvoiceSettings } from "../../../hooks/invoice-settings";
import MyPdfViewer from "../../../components/MyPdfViewer";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../../constants/invoice";
import { getTemplate } from "../../../components/templates/registry";
import { pdf } from "@react-pdf/renderer";

export type TemplateSettings = {
  template_id: InvoiceTemplateId;
  template_version: string;
  header_logo_type: InvoiceSettingsHeaderLogoType;
  header_logo_url: string;
  header_logo_text: string;
  header_content: JSONContent;
  footer_content: JSONContent;
  store_name: string;
  store_address: string;
  store_tax_id: string;
  bank_account_iban: string;
  bank_account_swift: string;
  auto_generate_on: InvoiceSettingsAutoGenerateTrigger[];
};

export default function Invoices() {
  const invoiceSettingsQuery = useInvoiceSettings();
  const ordersQuery = useOrders({
    fields: "id,display_id,created_at",
    limit: 100,
  });

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>("");
  const [previewType, setPreviewType] = React.useState<
    "dummy-data" | "select-order"
  >("dummy-data");
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);

  const orderQuery = useOrder(
    selectedOrderId,
    {
      fields:
        "id,status,created_at,canceled_at,email,display_id,currency_code,metadata,total,credit_line_total,item_subtotal,item_total,item_tax_total,original_item_tax_total,item_discount_total,shipping_subtotal,original_total,original_tax_total,subtotal,discount_total,discount_subtotal,shipping_total,shipping_tax_total,original_shipping_tax_total,shipping_discount_total,tax_total,refundable_total,order_change,*customer,*items,*items.variant,*items.variant.product,*items.variant.options,+items.variant.manage_inventory,*items.variant.inventory_items.inventory,+items.variant.inventory_items.required_quantity,+summary,*shipping_address,*billing_address,*sales_channel,*promotions,*shipping_methods,*credit_lines,*fulfillments,+fulfillments.shipping_option.service_zone.fulfillment_set.type,*fulfillments.items,*fulfillments.labels,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.refunds,*payment_collections.payments.refunds.refund_reason,region.automatic_taxes,",
    },
    {
      enabled: !!selectedOrderId,
    },
  );

  const [templateSettings, setTemplateSettings] =
    React.useState<TemplateSettings>({
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
      header_logo_url: "",
      header_logo_text: "",
      header_content: {},
      footer_content: {},
      store_name: "",
      store_address: "",
      store_tax_id: "",
      bank_account_iban: "",
      bank_account_swift: "",
      auto_generate_on: [],
    });

  const handlePreviewChange = React.useCallback(
    (value: string) => {
      if (value === "dummy-data") setSelectedOrderId("");
      setPreviewType(value as "dummy-data" | "select-order");
    },
    [setSelectedOrderId, setPreviewType],
  );

  const handleDownloadPreview = React.useCallback(async () => {
    if (previewType === "select-order" && !selectedOrderId) {
      toast.warning("No Order Selected", {
        description: "Please select an order to download the preview.",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const template = getTemplate(templateSettings.template_id);
      const TemplateComponent = template.Component;
      const order = orderQuery.data?.order;

      const doc = (
        <TemplateComponent settings={templateSettings} order={order} />
      );

      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const filename = `invoice-preview-${new Date().getTime()}.pdf`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Preview Downloaded", {
        description: "Invoice preview downloaded successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate invoice preview. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [templateSettings, orderQuery.data, previewType, selectedOrderId]);

  React.useEffect(() => {
    if (!invoiceSettingsQuery.data) {
      return;
    }

    const { settings } = invoiceSettingsQuery.data;

    setTemplateSettings({
      template_id: settings.template_id,
      template_version: settings.template_version,
      header_logo_type: settings.header_logo_type,
      header_logo_url: settings.header_logo_url ?? "",
      header_logo_text: settings.header_logo_text ?? "",
      header_content: settings.header_content
        ? JSON.parse(settings.header_content)
        : {},
      footer_content: settings.footer_content
        ? JSON.parse(settings.footer_content)
        : {},
      store_name: settings.store_name ?? "",
      store_address: settings.store_address ?? "",
      store_tax_id: settings.store_tax_id ?? "",
      bank_account_iban: settings.bank_account_iban ?? "",
      bank_account_swift: settings.bank_account_swift ?? "",
      auto_generate_on: settings.auto_generate_on,
    });
  }, [invoiceSettingsQuery.data]);

  return (
    <Container className="divide-y p-0">
      <div className="px-6 flex justify-between max-sm:flex-col sm:items-center gap-4 py-4">
        <div>
          <Heading>Invoices Plugin Configuration</Heading>
          <Text className="text-ui-fg-subtle">
            Configure your invoice settings and click "Save Settings" to save
            settings
          </Text>
        </div>
        <Drawer>
          <Drawer.Trigger asChild className="xl:hidden shrink-0">
            <Button variant="secondary">
              <SidebarRightIcon /> Invoice Settings
            </Button>
          </Drawer.Trigger>
          <Drawer.Content className="overflow-y-auto">
            <Drawer.Header>
              <Drawer.Title>Invoice Settings</Drawer.Title>
            </Drawer.Header>
            <div className="divide-y">
              {invoiceSettingsQuery.isLoading ? (
                <Text className="p-6 text-ui-fg-subtle">
                  Loading invoice settings…
                </Text>
              ) : invoiceSettingsQuery.isError ? (
                <Text className="p-6 text-ui-fg-error">
                  Failed to load invoice settings.
                </Text>
              ) : (
                <RenderTemplateSettings
                  previewType={previewType}
                  selectedOrderId={selectedOrderId}
                  renderHeading={false}
                  templateSettings={templateSettings}
                  setTemplateSettings={setTemplateSettings}
                />
              )}
            </div>
          </Drawer.Content>
        </Drawer>
      </div>
      <div className="px-6 gap-4 py-4 flex">
        <Container className="md:w-1/3 p-0 divide-y max-xl:hidden">
          {invoiceSettingsQuery.isLoading ? (
            <Text className="p-6 text-ui-fg-subtle">
              Loading invoice settings…
            </Text>
          ) : invoiceSettingsQuery.isError ? (
            <Text className="p-6 text-ui-fg-error">
              Failed to load invoice settings.
            </Text>
          ) : (
            <RenderTemplateSettings
              previewType={previewType}
              selectedOrderId={selectedOrderId}
              templateSettings={templateSettings}
              setTemplateSettings={setTemplateSettings}
            />
          )}
        </Container>
        <Container className="xl:w-2/3 p-0 divide-y">
          <div className="px-6 flex items-center justify-between flex-wrap gap-2 py-4">
            <Heading level="h2">Live Preview</Heading>
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={handleDownloadPreview}
              disabled={
                isDownloading ||
                (previewType === "select-order" &&
                  (!selectedOrderId || orderQuery.isError))
              }
              isLoading={isDownloading}
            >
              <ArrowDownTrayIcon />
              Download Preview
            </Button>
          </div>
          <div className="px-6 py-4 h-[calc(100%-64px)]">
            <Tabs
              defaultValue="dummy-data"
              className="h-full"
              onValueChange={(value) => handlePreviewChange(value)}
            >
              <Tabs.List className="mb-4 w-full bg-ui-bg-base-hover rounded-full p-1">
                <Tabs.Trigger value="dummy-data" className="flex-1">
                  Dummy Data
                </Tabs.Trigger>
                <Tabs.Trigger value="select-order" className="flex-1">
                  Select Order
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="dummy-data" className="h-[calc(100%-92px)]">
                <Text className="mb-4 text-ui-fg-subtle">
                  Using built-in sample order data for preview
                </Text>
                <MyPdfViewer
                  templateSettings={templateSettings}
                  previewType={previewType}
                  selectedOrderId={selectedOrderId}
                  orderQuery={orderQuery}
                />
              </Tabs.Content>
              <Tabs.Content
                value="select-order"
                className="h-[calc(100%-127px)]"
              >
                <Label>Select Order</Label>
                <div className="w-[256px] mt-1 mb-4">
                  <Select onValueChange={(value) => setSelectedOrderId(value)}>
                    <Select.Trigger>
                      <Select.Value placeholder="Select an order" />
                    </Select.Trigger>
                    <Select.Content>
                      {(ordersQuery.data?.orders ?? []).length > 0 ? (
                        ordersQuery.data!.orders.map((item) => (
                          <Select.Item key={item.id} value={item.id}>
                            {item.display_id} (
                            {new Date(item.created_at).toLocaleDateString()})
                          </Select.Item>
                        ))
                      ) : (
                        <Select.Group>
                          <Select.Label className="opacity-50 px-2 py-1">
                            There are no orders
                          </Select.Label>
                        </Select.Group>
                      )}
                    </Select.Content>
                  </Select>
                </div>
                <MyPdfViewer
                  templateSettings={templateSettings}
                  previewType={previewType}
                  selectedOrderId={selectedOrderId}
                  orderQuery={orderQuery}
                />
              </Tabs.Content>
            </Tabs>
          </div>
        </Container>
      </div>
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Invoices",
  icon: DocumentTextIcon,
});
