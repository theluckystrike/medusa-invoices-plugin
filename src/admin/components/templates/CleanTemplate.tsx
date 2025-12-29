import React from "react";
import { TemplateProps } from "./registry";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import renderTiptapNode from "../renderTiptapNode";

const styles = StyleSheet.create({
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
});

const CleanTemplate: React.FC<TemplateProps> = ({ order, settings }) => {
  console.log("Order: ", order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          render={() =>
            settings?.header_logo_type === "text" &&
            settings.header_logo_text && (
              <Text style={styles.heading}>{settings.header_logo_text}</Text>
            )
          }
        />
        <View
          render={() =>
            settings?.header_logo_type === "image" &&
            settings.header_logo_url && (
              <Image
                src={settings.header_logo_url}
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
            settings?.header_content && (
              <View style={styles.header}>
                {renderTiptapNode(settings.header_content, 0)}
              </View>
            )
          }
        />
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text style={{ marginBottom: "2px" }}>
            <Text style={styles.label}>Invoice number:</Text> #4234234
          </Text>
          <Text style={{ marginBottom: "2px" }}>
            <Text style={styles.label}>Invoice date:</Text>{" "}
            {order
              ? new Date(order.created_at).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </Text>
          <Text>
            <Text style={styles.label}>Order ID:</Text>{" "}
            {order ? order.display_id : "#fsdfsdg"}
          </Text>
        </View>

        <View
          style={[
            styles.section,
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <View>
            <Text style={[styles.label, { marginBottom: "2px" }]}>
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
            <Text style={[styles.label, { marginBottom: "2px" }]}>
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
            styles.section,
            settings?.template_id === "compact"
              ? { borderBottom: "1px solid #eee" }
              : {},
          ]}
        >
          <View
            style={[
              styles.itemRow,
              {
                marginBottom: "16px",
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Item Title</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>SKU</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>QTY</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Unit price</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Line total</Text>
            </View>
          </View>

          {order ? (
            order.items.map((i) => (
              <View key={i.id} style={styles.itemRow}>
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
              <View style={styles.itemRow}>
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
              <View style={styles.itemRow}>
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
        <View style={styles.totals}>
          <View style={{ gap: "6px" }}>
            <Text>Subtotal:</Text>
            <Text>Discount:</Text>
            <Text>Shipping:</Text>
            <Text>Tax:</Text>
            <Text style={styles.grandTotal}>Grand Total:</Text>
          </View>
          <View style={{ gap: "6px" }}>
            <Text>{order ? `$${order.subtotal}` : "$234.00"}</Text>
            <Text>{order ? `$${order.discount_total}` : "$2.00"}</Text>
            <Text>{order ? `$${order.shipping_total}` : "$234.00"}</Text>
            <Text>{order ? `$${order.tax_total}` : "$234.00"}</Text>
            <Text style={styles.grandTotal}>
              {order ? `$${order.total}` : "$234.00"}
            </Text>
          </View>
        </View>

        <View
          style={styles.section}
          render={() =>
            (settings?.store_name ||
              settings?.store_address ||
              settings?.store_tax_id ||
              settings?.bank_account_iban ||
              settings?.bank_account_swift) && (
              <>
                {settings.store_name && (
                  <Text style={{ marginBottom: "4px" }}>
                    {settings.store_name}
                  </Text>
                )}
                {settings.store_address && (
                  <Text style={{ marginBottom: "4px" }}>
                    {settings.store_address}
                  </Text>
                )}
                {settings.store_tax_id && (
                  <Text style={{ marginBottom: "4px" }}>
                    Tax ID: {settings.store_tax_id}
                  </Text>
                )}
                {settings.bank_account_iban && (
                  <Text style={{ marginBottom: "4px" }}>
                    IBAN: {settings.bank_account_iban}
                  </Text>
                )}
                {settings.bank_account_swift && (
                  <Text>SWIFT: {settings.bank_account_swift}</Text>
                )}
              </>
            )
          }
        />

        {settings?.footer_content && (
          <View style={styles.footer}>
            {renderTiptapNode(settings.footer_content, 0)}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CleanTemplate;
