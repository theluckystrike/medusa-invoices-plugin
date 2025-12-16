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
} from "@medusajs/ui";
import React from "react";
import { useOrders } from "../../../hooks/orders";
import { JSONContent } from "@tiptap/react";
import RenderTemplateSettings from "../../../components/RenderTemplateSettings";
import { useInvoiceSettings } from "../../../hooks/invoice-settings";
import { MyPdfViewer } from "../../../components/MyPdfViewer";

export type TemplateSettings = {
  style: "clean" | "classic" | "compact";
  headerType: "image" | "heading" | "none";
  imageUrl: string;
  headerText: string;
  additionalHeaderContent: JSONContent;
  additionalFooterContent: JSONContent;
  business: {
    name: string;
    address: string;
    tax_id: string;
    iban: string;
    swift: string;
  };
  orderCompleted: boolean;
  paymentCaptured: boolean;
  fulfillmentCreated: boolean;
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

  const [templateSettings, setTemplateSettings] =
    React.useState<TemplateSettings>({
      style: "clean",
      headerType: "image",
      imageUrl: "",
      headerText: "",
      additionalHeaderContent: {},
      additionalFooterContent: {},
      business: {
        name: "",
        address: "",
        tax_id: "",
        iban: "",
        swift: "",
      },
      orderCompleted: false,
      paymentCaptured: false,
      fulfillmentCreated: false,
    });

  const handlePreviewChange = React.useCallback((value: string) => {
    if (value === "dummy-data") setSelectedOrderId("");
    setPreviewType(value as "dummy-data" | "select-order");
  }, []);

  React.useEffect(() => {
    if (!invoiceSettingsQuery.data) {
      return;
    }

    const settings = invoiceSettingsQuery.data;

    setTemplateSettings({
      style: settings.style,
      headerType: settings.header_type,
      imageUrl: settings.image_url ?? "",
      headerText: settings.header_text ?? "",
      additionalHeaderContent: settings.additional_header_content ?? {},
      additionalFooterContent: settings.additional_footer_content ?? {},
      business: {
        name: settings.business?.name ?? "",
        address: settings.business?.address ?? "",
        tax_id: settings.business?.tax_id ?? "",
        iban: settings.business?.iban ?? "",
        swift: settings.business?.swift ?? "",
      },
      orderCompleted: settings.auto_order_completed,
      paymentCaptured: settings.auto_payment_captured,
      fulfillmentCreated: settings.auto_fullfillment_created,
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
            <Button variant="secondary" className="shrink-0">
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
