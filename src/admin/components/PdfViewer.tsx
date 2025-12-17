import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { renderTiptapNode } from "./renderTiptapNode";
import { useOrder } from "../hooks/orders";

const templateStyles = StyleSheet.create({
  clean: {
    page: {
      backgroundColor: "#fff",
      padding: "32px",
      color: "#52525b",
    },
    header: {},
    section: {
      marginBottom: "32px",
      paddingBottom: "32px",
    },
    heading: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "32px",
      color: "#18181b",
    },
    label: {
      fontWeight: "bold",
      textTransform: "uppercase" as const,
      fontSize: "14px",
      letterSpacing: "1px",
      color: "#18181b",
    },
    itemRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: "10px",
      paddingBottom: "8px",
      marginBottom: "8px",
    },
    totals: {
      flexDirection: "row" as const,
      gap: "40px",
      justifyContent: "flex-end" as const,
      marginBottom: "32px",
      paddingBottom: "32px",
    },
    grandTotal: {
      fontWeight: "bold",
      fontSize: "22px",
      marginTop: "6px",
      color: "#18181b",
    },
    footer: {
      marginTop: "64px",
    },
  },
  classic: {
    page: {
      backgroundColor: "#fff",
      padding: "32px",
      color: "#52525b",
    },
    header: {
      padding: "8px",
      border: "1px solid #eee",
      marginBottom: "32px",
    },
    section: {
      marginBottom: "32px",
      paddingBottom: "32px",
    },
    heading: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "32px",
      color: "#18181b",
    },
    label: {
      fontWeight: "bold",
      textTransform: "uppercase" as const,
      fontSize: "14px",
      letterSpacing: "1px",
      color: "#18181b",
    },
    itemRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: "10px",
      paddingBottom: "8px",
      marginBottom: "8px",
      borderBottom: "1px solid #eee",
    },
    totals: {
      flexDirection: "row" as const,
      gap: "40px",
      justifyContent: "space-between" as const,
      padding: "8px",
      border: "1px solid #eee",
      backgroundColor: "#f9f9f9",
      marginBottom: "32px",
      paddingBottom: "32px",
    },
    grandTotal: {
      fontSize: "22px",
      marginTop: "6px",
      color: "#18181b",
    },
    footer: {
      marginTop: "64px",
    },
  },
  compact: {
    page: {
      backgroundColor: "#fff",
      padding: "12px",
      fontSize: "12px",
      color: "#52525b",
    },
    header: {},
    section: {
      marginBottom: "12px",
      paddingBottom: "12px",
    },
    heading: {
      fontSize: "20px",
      fontWeight: "medium",
      marginBottom: "12px",
      color: "#18181b",
    },
    label: {
      fontWeight: "bold",
      textTransform: "uppercase" as const,
      fontSize: "10px",
      letterSpacing: "1px",
      color: "#18181b",
    },
    itemRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: "10px",
      paddingBottom: "8px",
      marginBottom: "8px",
    },
    totals: {
      flexDirection: "row" as const,
      gap: "40px",
      justifyContent: "flex-end" as const,
      marginBottom: "12px",
      paddingBottom: "12px",
    },
    grandTotal: {
      fontSize: "15px",
      marginTop: "6px",
      color: "#18181b",
    },
    footer: {
      marginTop: "64px",
    },
  },
});

type PdfViewerProps = {
  templateSettings: TemplateSettings;
  previewType: "dummy-data" | "select-order";
  selectedOrderId: string;
};

export const PdfViewer: React.FC<PdfViewerProps> = ({
  templateSettings,
  previewType,
  selectedOrderId,
}) => {
  const orderQuery = useOrder(
    selectedOrderId,
    {
      fields:
        "id,status,created_at,canceled_at,email,display_id,currency_code,metadata,total,credit_line_total,item_subtotal,item_total,item_tax_total,original_item_tax_total,item_discount_total,shipping_subtotal,original_total,original_tax_total,subtotal,discount_total,discount_subtotal,shipping_total,shipping_tax_total,original_shipping_tax_total,shipping_discount_total,tax_total,refundable_total,order_change,*customer,*items,*items.variant,*items.variant.product,*items.variant.options,+items.variant.manage_inventory,*items.variant.inventory_items.inventory,+items.variant.inventory_items.required_quantity,+summary,*shipping_address,*billing_address,*sales_channel,*promotions,*shipping_methods,*credit_lines,*fulfillments,+fulfillments.shipping_option.service_zone.fulfillment_set.type,*fulfillments.items,*fulfillments.labels,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.refunds,*payment_collections.payments.refunds.refund_reason,region.automatic_taxes",
    },
    {
      enabled: !!selectedOrderId,
    },
  );

  const order = orderQuery.data?.order;

  if (previewType === "select-order" && !selectedOrderId) {
    return <div>Please select an order to preview the invoice.</div>;
  }

  if (
    previewType === "select-order" &&
    selectedOrderId &&
    orderQuery.isLoading
  ) {
    return <div>Loading order invoice preview...</div>;
  }

  if (selectedOrderId && orderQuery.isError) {
    return <div>Failed to load order data</div>;
  }

  return (
    <PDFViewer showToolbar={false} height="100%" width="100%">
      <Document>
        <Page
          size="A4"
          style={templateStyles[templateSettings.template_id].page}
        >
          <View
            render={() =>
              templateSettings.header_logo_type === "heading" &&
              templateSettings.header_logo_text && (
                <Text
                  style={templateStyles[templateSettings.template_id].heading}
                >
                  {templateSettings.header_logo_text}
                </Text>
              )
            }
          />
          <View
            render={() =>
              templateSettings.header_logo_type === "image" &&
              templateSettings.header_logo_url && (
                <Image
                  src={templateSettings.header_logo_url}
                  style={{
                    width: "auto",
                    height: "40px",
                    objectFit: "contain",
                    marginBottom: "20px",
                  }}
                />
              )
            }
          />
          <View
            render={() =>
              templateSettings.header_content && (
                <View
                  style={templateStyles[templateSettings.template_id].header}
                >
                  {renderTiptapNode(templateSettings.header_content, 0)}
                </View>
              )
            }
          />
          <View style={templateStyles[templateSettings.template_id].section}>
            <Text style={templateStyles[templateSettings.template_id].heading}>
              Invoice
            </Text>
            <Text style={{ marginBottom: "2px" }}>
              <Text style={templateStyles[templateSettings.template_id].label}>
                Invoice number:
              </Text>{" "}
              #4234234
            </Text>
            <Text style={{ marginBottom: "2px" }}>
              <Text style={templateStyles[templateSettings.template_id].label}>
                Invoice date:
              </Text>{" "}
              {order
                ? new Date(order.created_at).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </Text>
            <Text>
              <Text style={templateStyles[templateSettings.template_id].label}>
                Order ID:
              </Text>{" "}
              {order ? order.display_id : "#fsdfsdg"}
            </Text>
          </View>

          <View
            style={[
              templateStyles[templateSettings.template_id].section,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <View>
              <Text
                style={[
                  templateStyles[templateSettings.template_id].label,
                  { marginBottom: "2px" },
                ]}
              >
                Bill to:
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.billing_address?.first_name} ${order.billing_address?.last_name}`
                  : "Lorem ipsum"}
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.billing_address?.address_1}, ${order.billing_address?.city}`
                  : "Soltanska 45b, Split"}
              </Text>
              <Text>
                {order ? order.billing_address?.phone : "+385 99 543 2345"}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  templateStyles[templateSettings.template_id].label,
                  { marginBottom: "2px" },
                ]}
              >
                Ship to:
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`
                  : "Lorem ipsum"}
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.shipping_address?.address_1}, ${order.shipping_address?.city}`
                  : "Soltanska 45b, Split"}
              </Text>
              <Text>{order ? order.customer?.phone : "+385 99 543 2345"}</Text>
            </View>
          </View>
          <View
            style={[
              templateStyles[templateSettings.template_id].section,
              templateSettings.template_id === "compact"
                ? { borderBottom: "1px solid #eee" }
                : {},
            ]}
          >
            <View
              style={[
                templateStyles[templateSettings.template_id].itemRow,
                {
                  marginBottom: "16px",
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={templateStyles[templateSettings.template_id].label}
                >
                  Item Title
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={templateStyles[templateSettings.template_id].label}
                >
                  SKU
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={templateStyles[templateSettings.template_id].label}
                >
                  QTY
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={templateStyles[templateSettings.template_id].label}
                >
                  Unit price
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={templateStyles[templateSettings.template_id].label}
                >
                  Line total
                </Text>
              </View>
            </View>

            {order ? (
              order.items.map((i) => (
                <View
                  key={i.id}
                  style={templateStyles[templateSettings.template_id].itemRow}
                >
                  <View style={{ flex: 1 }}>
                    <Text>{i.title}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{i.variant_sku}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{i.quantity}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>${i.unit_price.toFixed(2)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>${i.total.toFixed(2)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <>
                <View
                  style={templateStyles[templateSettings.template_id].itemRow}
                >
                  <View style={{ flex: 1 }}>
                    <Text>Premium Widget</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>SKU123</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>$100.00</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>$100.00</Text>
                  </View>
                </View>
                <View
                  style={templateStyles[templateSettings.template_id].itemRow}
                >
                  <View style={{ flex: 1 }}>
                    <Text>Standard Service</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>SKU4324</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>4</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>$134.00</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>$134.00</Text>
                  </View>
                </View>
              </>
            )}
          </View>
          <View style={templateStyles[templateSettings.template_id].totals}>
            <View style={{ gap: "6px" }}>
              <Text>Subtotal:</Text>
              <Text>Discount:</Text>
              <Text>Shipping:</Text>
              <Text>Tax:</Text>
              <Text
                style={templateStyles[templateSettings.template_id].grandTotal}
              >
                Grand Total:
              </Text>
            </View>
            <View style={{ gap: "6px" }}>
              <Text>{order ? `$${order.subtotal}` : "$234.00"}</Text>
              <Text>{order ? `$${order.discount_total}` : "$2.00"}</Text>
              <Text>{order ? `$${order.shipping_total}` : "$234.00"}</Text>
              <Text>{order ? `$${order.tax_total}` : "$234.00"}</Text>
              <Text
                style={templateStyles[templateSettings.template_id].grandTotal}
              >
                {order ? `$${order.total}` : "$234.00"}
              </Text>
            </View>
          </View>

          <View
            style={templateStyles[templateSettings.template_id].section}
            render={() =>
              (templateSettings.store_name ||
                templateSettings.store_address ||
                templateSettings.store_tax_id ||
                templateSettings.bank_account_iban ||
                templateSettings.bank_account_swift) && (
                <>
                  {templateSettings.store_name && (
                    <Text style={{ marginBottom: "4px" }}>
                      {templateSettings.store_name}
                    </Text>
                  )}
                  {templateSettings.store_address && (
                    <Text style={{ marginBottom: "4px" }}>
                      {templateSettings.store_address}
                    </Text>
                  )}
                  {templateSettings.store_tax_id && (
                    <Text style={{ marginBottom: "4px" }}>
                      Tax ID: {templateSettings.store_tax_id}
                    </Text>
                  )}
                  {templateSettings.bank_account_iban && (
                    <Text style={{ marginBottom: "4px" }}>
                      IBAN: {templateSettings.bank_account_iban}
                    </Text>
                  )}
                  {templateSettings.bank_account_swift && (
                    <Text>SWIFT: {templateSettings.bank_account_swift}</Text>
                  )}
                </>
              )
            }
          />

          {templateSettings.footer_content && (
            <View style={templateStyles[templateSettings.template_id].footer}>
              {renderTiptapNode(templateSettings.footer_content, 0)}
            </View>
          )}
        </Page>
      </Document>
    </PDFViewer>
  );
};
