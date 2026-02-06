import renderTipTapNode from "../renderTipTapNode";
import defaultTipTapNodeStyles from "./defaultTipTapNodeStyles";
import { TemplateProps } from "../types";
import { formatCurrency, formatNumber } from "../helpers/number-format";
import { breakLongString } from "../helpers/text-wrapping";

const CleanTemplate = (async () => {
  const { Document, Image, Page, StyleSheet, Text, View, Link } =
    await import("@react-pdf/renderer");

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "24px",
      color: "#52525b",
      fontSize: "13px",
    },
    header: {
      marginBottom: "24px",
      padding: "0 80px",
      gap: "10px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#18181b",
      textAlign: "center",
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
      gap: "10px",
      paddingBottom: "6px",
      marginBottom: "6px",
    },
    totals: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: "40px",
      justifyContent: "flex-end" as const,
    },
    grandTotal: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "3px",
      color: "#18181b",
    },
    footer: {
      marginTop: "24px",
    },
  });

  const tipTapNodeStyles = StyleSheet.create(defaultTipTapNodeStyles);

  return ({ order, settings }: TemplateProps) => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {settings.header_logo.type !== "none" && (
            <View style={styles.header}>
              {settings.header_logo.type === "text" &&
                settings.header_logo.text && (
                  <Text style={styles.heading}>
                    {settings.header_logo.text}
                  </Text>
                )}

              {settings.header_logo.type === "image" &&
                settings.header_logo.url && (
                  <Image
                    src={settings.header_logo.url}
                    style={{
                      width: "auto",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                )}

              {settings.header_content && settings.header_content.content && (
                <View>
                  {renderTipTapNode({
                    node: settings.header_content,
                    components: { View, Text, Link },
                    tipTapStyles: tipTapNodeStyles,
                  })}
                </View>
              )}
            </View>
          )}

          <View style={{ marginBottom: "36px" }}>
            <Text
              style={{
                marginBottom: "32px",
                fontSize: "36px",
                fontWeight: "bold",
                color: "#18181b",
              }}
            >
              Invoice
            </Text>

            <View>
              <Text style={{ marginBottom: "5px" }}>
                <Text style={styles.label}>Invoice number:</Text>{" "}
                {order.display_id}
              </Text>

              <Text style={{ marginBottom: "5px" }}>
                <Text style={styles.label}>Invoice date:</Text>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </Text>

              <Text>
                <Text style={styles.label}>Order ID:</Text> {order.id}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "10px",
              marginBottom: "36px",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={[styles.label, { marginBottom: "7px" }]}>
                Bill to:
              </Text>
              {order.billing_address && (
                <View>
                  <Text style={{ marginBottom: "5px" }}>
                    {`${order.billing_address.first_name} ${order.billing_address.last_name}`}
                  </Text>

                  <Text style={{ marginBottom: "5px" }}>
                    {`${order.billing_address.address_1}, ${order.billing_address.city}`}
                  </Text>

                  <Text>{order.billing_address.phone}</Text>
                </View>
              )}
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={[styles.label, { marginBottom: "7px" }]}>
                Ship to:
              </Text>

              {order.shipping_address && (
                <View>
                  <Text style={{ marginBottom: "5px" }}>
                    {`${order.shipping_address.first_name} ${order.shipping_address.last_name}`}
                  </Text>

                  <Text style={{ marginBottom: "5px" }}>
                    {`${order.shipping_address.address_1}, ${order.shipping_address.city}`}
                  </Text>

                  <Text>{order.shipping_address.phone}</Text>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              marginBottom: "18px",
            }}
          >
            <View style={[styles.itemRow]}>
              <Text style={[styles.label, { width: "30%" }]}>Item Title</Text>

              <Text style={[styles.label, { width: "20%" }]}>SKU</Text>

              <Text style={[styles.label, { width: "10%" }]}>QTY</Text>

              <Text style={[styles.label, { width: "20%" }]}>Unit price</Text>

              <Text style={[styles.label, { width: "20%" }]}>Line total</Text>
            </View>

            {order.items &&
              order.items.map((i) => (
                <View key={i.id} style={styles.itemRow}>
                  <Text style={{ width: "30%" }}>{i.title}</Text>

                  <Text style={{ width: "20%" }}>
                    {i.variant_sku ? breakLongString(i.variant_sku, 12) : "-"}
                  </Text>

                  <Text style={{ width: "10%" }}>
                    {formatNumber(i.quantity)}
                  </Text>

                  <Text style={{ width: "20%" }}>
                    {formatCurrency(i.unit_price, order.currency_code)}
                  </Text>

                  <Text style={{ width: "20%" }}>
                    {formatCurrency(i.total, order.currency_code)}
                  </Text>
                </View>
              ))}
          </View>

          <View style={styles.totals} wrap={false}>
            <View style={{ gap: "5px" }}>
              <Text>Subtotal:</Text>
              <Text>Discount:</Text>
              <Text>Shipping:</Text>
              <Text>Tax:</Text>
              <Text style={styles.grandTotal}>Grand Total:</Text>
            </View>

            <View style={{ gap: "5px" }}>
              <Text>{formatCurrency(order.subtotal, order.currency_code)}</Text>
              <Text>
                {formatCurrency(order.discount_total, order.currency_code)}
              </Text>
              <Text>
                {formatCurrency(order.shipping_total, order.currency_code)}
              </Text>
              <Text>
                {formatCurrency(order.tax_total, order.currency_code)}
              </Text>
              <Text style={styles.grandTotal}>
                {formatCurrency(order.total, order.currency_code)}
              </Text>
            </View>
          </View>

          {(settings.store_name ||
            settings.store_address ||
            settings.store_tax_id ||
            settings.bank_account_iban ||
            settings.bank_account_swift) && (
            <View style={{ marginTop: "24px" }} wrap={false}>
              {settings.store_name && (
                <Text style={{ marginBottom: "3px" }}>
                  BUSINESS NAME:{"  "}
                  {settings.store_name}
                </Text>
              )}
              {settings.store_address && (
                <Text style={{ marginBottom: "3px" }}>
                  ADDRESS:{"  "}
                  {settings.store_address}
                </Text>
              )}
              {settings.store_tax_id && (
                <Text style={{ marginBottom: "3px" }}>
                  TAX ID:{"  "}
                  {settings.store_tax_id}
                </Text>
              )}
              {settings.bank_account_iban && (
                <Text style={{ marginBottom: "3px" }}>
                  IBAN:{"  "}
                  {settings.bank_account_iban}
                </Text>
              )}
              {settings.bank_account_swift && (
                <Text>
                  SWIFT:{"  "}
                  {settings.bank_account_swift}
                </Text>
              )}
            </View>
          )}

          {settings.footer_content && settings.footer_content.content && (
            <View wrap={false} style={styles.footer}>
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

export default CleanTemplate;
