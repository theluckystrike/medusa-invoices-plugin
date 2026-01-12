import renderTipTapNode from "../renderTipTapNode";
import defaultTipTapNodeStyles from "./defaultTipTapNodeStyles";
import { TemplateProps } from "../types";
import { formatCurrency, formatNumber } from "../utils/number-format";

const CompactTemplate = (async () => {
  const { Document, Image, Page, StyleSheet, Text, View, Link } =
    await import("@react-pdf/renderer");

  const styles = StyleSheet.create({
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
  });

  const tipTapNodeStyles = StyleSheet.create(defaultTipTapNodeStyles);

  return ({ order, settings }: TemplateProps) => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View
            render={() =>
              settings?.header_logo.type === "text" &&
              settings.header_logo.text && (
                <Text style={styles.heading}>{settings.header_logo.text}</Text>
              )
            }
          />
          <View
            render={() =>
              settings?.header_logo.type === "image" &&
              settings.header_logo.url && (
                <Image
                  src={settings.header_logo.url}
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
                  {renderTipTapNode({
                    node: settings.header_content,
                    components: { View, Text, Link },
                    tipTapStyles: tipTapNodeStyles,
                  })}
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
              {order ? order.display_id : "#12345678"}
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
                  : "John Doe"}
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.billing_address?.address_1}, ${order.billing_address?.city}`
                  : "Apple street 123, New York"}
              </Text>
              <Text>
                {order ? order.billing_address?.phone : "+1 234 567 8901"}
              </Text>
            </View>

            <View>
              <Text style={[styles.label, { marginBottom: "2px" }]}>
                Ship to:
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`
                  : "John Doe"}
              </Text>
              <Text style={{ marginBottom: "2px" }}>
                {order
                  ? `${order.shipping_address?.address_1}, ${order.shipping_address?.city}`
                  : "Apple street 123, New York"}
              </Text>
              <Text>
                {order ? order.shipping_address?.phone : "+1 234 567 8901"}
              </Text>
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

            {order && order.items ? (
              order.items.map((i) => (
                <View key={i.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text>{i.title}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{i.variant_sku}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{formatNumber(i.quantity)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>
                      {formatCurrency(i.unit_price, order.currency_code)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{formatCurrency(i.total, order.currency_code)}</Text>
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
              <Text>
                {order
                  ? `${formatCurrency(order.subtotal, order.currency_code)}`
                  : "$234.00"}
              </Text>
              <Text>
                {order
                  ? `${formatCurrency(order.discount_total, order.currency_code)}`
                  : "$2.00"}
              </Text>
              <Text>
                {order
                  ? `${formatCurrency(order.shipping_total, order.currency_code)}`
                  : "$234.00"}
              </Text>
              <Text>
                {order
                  ? `${formatCurrency(order.tax_total, order.currency_code)}`
                  : "$234.00"}
              </Text>
              <Text style={styles.grandTotal}>
                {order
                  ? `${formatCurrency(order.total, order.currency_code)}`
                  : "$234.00"}
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
              {renderTipTapNode({
                node: settings.footer_content,
                components: { View, Text, Link },
                tipTapStyles: tipTapNodeStyles,
              })}
            </View>
          )}
        </Page>
      </Document>
    );
  };
})();

export default CompactTemplate;
