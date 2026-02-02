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
import PdfViewer from "../../../components/PdfViewer";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../../constants/invoice";
import { pdf } from "@react-pdf/renderer";
import DummyPdfViewer from "../../../components/DummyPdfViewer";
import { orderDummyData } from "../../../components/templateDummyData";
import { getTemplate } from "../../../templates/registry";
import { useSearchParams } from "react-router-dom";

export type TemplateSettings = {
  template_id: InvoiceTemplateId;
  template_version: string;
  header_logo: {
    type: InvoiceSettingsHeaderLogoType;
    text: string;
    url: string;
  };
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
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get("order_id");

  const invoiceSettingsQuery = useInvoiceSettings();
  const ordersQuery = useOrders({
    fields: "id,display_id,created_at",
    limit: 100,
  });

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(
    orderIdFromUrl || "",
  );
  const [previewType, setPreviewType] = React.useState<
    "dummy-data" | "select-order"
  >(orderIdFromUrl ? "select-order" : "dummy-data");
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);

  const orderQuery = useOrder(
    selectedOrderId,
    {
      fields:
        "id,status,created_at,canceled_at,email,display_id,currency_code,total,subtotal,discount_total,shipping_total,tax_total,*customer,*items,*items.variant,*shipping_address,*billing_address",
    },
    {
      enabled: !!selectedOrderId,
    },
  );

  const [templateSettings, setTemplateSettings] =
    React.useState<TemplateSettings>({
      template_id: InvoiceTemplateId.CLEAN,
      template_version: "1.0.0",
      header_logo: {
        type: InvoiceSettingsHeaderLogoType.NONE,
        text: "",
        url: "",
      },
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
      let order;

      if (previewType === "dummy-data") {
        order = orderDummyData;
      } else {
        order = orderQuery.data?.order;
      }

      if (!order) {
        throw new Error("Failed to fetch order data");
      }

      const invoice = {
        id: "inv_01",
        created_at: order.created_at,
        display_number: order.display_id,
      };

      const template = await getTemplate(templateSettings.template_id);
      const templateComponent = await template.render({
        order,
        settings: templateSettings,
        invoice,
      });

      const blob = await pdf(templateComponent).toBlob();

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
      header_logo: {
        type: settings.header_logo_type,
        text: settings.header_logo_text ?? "",
        url: settings.header_logo_url ?? "",
      },
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

  React.useEffect(() => {
    if (orderIdFromUrl && ordersQuery.data?.orders) {
      const orderExists = ordersQuery.data.orders.find(
        (order) => order.id === orderIdFromUrl,
      );

      if (orderExists) {
        setSelectedOrderId(orderIdFromUrl);
        setPreviewType("select-order");
      }
    }
  }, [orderIdFromUrl, ordersQuery.data]);

  const { auto_generate_on, ...previewTemplateSettings } = templateSettings;

  return (
    <Container className="divide-y p-0">
      <div className="px-6 flex items-start justify-between max-sm:flex-col gap-x-4 gap-y-6 py-4">
        <div>
          <Heading>Invoices Plugin Configuration</Heading>
          <Text className="text-ui-fg-subtle">
            Configure your invoice settings and click "Save Settings" to save
            settings
          </Text>
          {invoiceSettingsQuery.isError &&
            invoiceSettingsQuery.error?.status === 404 && (
              <Text className="pt-4 text-ui-fg-error">
                Invoice settings not found. Please set up your invoice settings.
              </Text>
            )}
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
              ) : invoiceSettingsQuery.isError &&
                invoiceSettingsQuery.error?.status === 404 ? (
                <RenderTemplateSettings
                  previewType={previewType}
                  selectedOrderId={selectedOrderId}
                  renderHeading={false}
                  templateSettings={templateSettings}
                  setTemplateSettings={setTemplateSettings}
                />
              ) : invoiceSettingsQuery.isError ? (
                <Text className="p-6 text-ui-fg-error">
                  {invoiceSettingsQuery.error.message ||
                    "Failed to load invoice settings."}
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
      <div className="px-6 gap-4 py-4 flex items-start min-h-[calc(100vh-4rem)]">
        <Container className="md:w-1/3 p-0 divide-y max-xl:hidden">
          {invoiceSettingsQuery.isLoading ? (
            <Text className="p-6 text-ui-fg-subtle">
              Loading invoice settings…
            </Text>
          ) : invoiceSettingsQuery.isError &&
            invoiceSettingsQuery.error?.status === 404 ? (
            <RenderTemplateSettings
              previewType={previewType}
              selectedOrderId={selectedOrderId}
              renderHeading={true}
              templateSettings={templateSettings}
              setTemplateSettings={setTemplateSettings}
            />
          ) : invoiceSettingsQuery.isError ? (
            <Text className="p-6 text-ui-fg-error">
              {invoiceSettingsQuery.error.message ||
                "Failed to load invoice settings."}
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
        <Container className="xl:w-2/3 p-0 divide-y sticky top-4 self-start h-[calc(100vh-5.3rem)] overflow-hidden">
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
              value={previewType}
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
                {previewType === "dummy-data" ? (
                  <DummyPdfViewer templateSettings={previewTemplateSettings} />
                ) : (
                  <PdfViewer
                    templateSettings={previewTemplateSettings}
                    selectedOrderId={selectedOrderId}
                    orderQuery={orderQuery}
                  />
                )}
              </Tabs.Content>
              <Tabs.Content
                value="select-order"
                className="h-[calc(100%-127px)]"
              >
                <Label>Select Order</Label>
                <div className="w-[256px] mt-1 mb-4">
                  <Select
                    value={selectedOrderId}
                    onValueChange={(value) => setSelectedOrderId(value)}
                  >
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
                {previewType === "dummy-data" ? (
                  <DummyPdfViewer templateSettings={previewTemplateSettings} />
                ) : (
                  <PdfViewer
                    templateSettings={previewTemplateSettings}
                    selectedOrderId={selectedOrderId}
                    orderQuery={orderQuery}
                  />
                )}
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
