import React from "react";
import { TemplateProps } from "../types/templates";
import { normalizeNumber } from "../utils/normalize";
import renderTipTapNode from "./renderTipTapNode";
import tipTapNodeStyles from "./styles/tipTapNode";

const createTemplate = async ({
  order,
  settings,
  invoice,
  currency_code,
  _styles,
}: TemplateProps): Promise<React.ReactElement> => {
  const ReactPDF = await import("@react-pdf/renderer");
  const { Document, Page, View, Text, Image, Link, StyleSheet } = ReactPDF;

  const styles = StyleSheet.create(_styles);

  const tipTapStyles = StyleSheet.create(tipTapNodeStyles);
  const components = {
    View,
    Text,
    Link,
  };

  console.log("Order: ", order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          render={() =>
            settings.header_logo.type === "text" &&
            settings.header_logo.text && (
              <Text style={styles.heading}>{settings.header_logo.text}</Text>
            )
          }
        />
        <View
          render={() =>
            settings.header_logo.type === "image" &&
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
            settings.header_content && (
              <View style={styles.header}>
                {renderTipTapNode({
                  node: JSON.parse(settings.header_content),
                  index: 0,
                  tipTapStyles,
                  components,
                })}
              </View>
            )
          }
        />
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text style={{ marginBottom: "2px" }}>
            <Text style={styles.label}>Invoice number:</Text>{" "}
            {invoice.display_number}
          </Text>
          <Text style={{ marginBottom: "2px" }}>
            <Text style={styles.label}>Invoice date: </Text>
            {new Date(invoice.created_at).toLocaleDateString()}
          </Text>
          <Text>
            <Text style={styles.label}>Order ID:</Text> {order.id}
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
              {`${order.billing_address?.first_name} ${order.billing_address?.last_name}`}
            </Text>
            <Text style={{ marginBottom: "2px" }}>
              {`${order.billing_address?.address_1}, ${order.billing_address?.city}`}
            </Text>
            <Text>{order.billing_address?.phone}</Text>
          </View>

          <View>
            <Text style={[styles.label, { marginBottom: "2px" }]}>
              Ship to:
            </Text>
            <Text style={{ marginBottom: "2px" }}>
              {`${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`}
            </Text>
            <Text style={{ marginBottom: "2px" }}>
              {`${order.shipping_address?.address_1}, ${order.shipping_address?.city}`}
            </Text>
            <Text>{order.shipping_address?.phone}</Text>
          </View>
        </View>
        <View
          style={[
            styles.section,
            settings.template_id === "compact"
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

          {order.items?.map((i) => (
            <View key={i.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text>{i.title}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{i.variant_sku}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{normalizeNumber(i.quantity)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(i.unit_price).toFixed(2)}`}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(i.total).toFixed(2)}`}</Text>
              </View>
            </View>
          ))}
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
            <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(order.subtotal).toFixed(2)}`}</Text>
            <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(order.discount_total).toFixed(2)}`}</Text>
            <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(order.shipping_total).toFixed(2)}`}</Text>
            <Text>{`${currency_code.toUpperCase()} ${normalizeNumber(order.tax_total).toFixed(2)}`}</Text>
            <Text
              style={styles.grandTotal}
            >{`${currency_code.toUpperCase()} ${normalizeNumber(order.total).toFixed(2)}`}</Text>
          </View>
        </View>

        <View
          style={styles.section}
          render={() =>
            (settings.store_name ||
              settings.store_address ||
              settings.store_tax_id ||
              settings.bank_account_iban ||
              settings.bank_account_swift) && (
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

        {settings.footer_content && (
          <View style={styles.footer}>
            {renderTipTapNode({
              node: JSON.parse(settings.footer_content),
              index: 0,
              tipTapStyles,
              components,
            })}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default createTemplate;
