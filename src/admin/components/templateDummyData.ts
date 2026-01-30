import { TemplateOrderProp } from "../templates/types";

export const orderDummyData: TemplateOrderProp = {
  id: "order_01DKF45RS7TH",
  display_id: 9876543,
  created_at: new Date("2026-01-28T10:32:00Z"),
  currency_code: "eur",
  billing_address: {
    first_name: "Michael",
    last_name: "Johnson",
    address_1: "742 Evergreen Terrace",
    city: "Springfield",
    phone: "+1 555 123 4567",
  },
  shipping_address: {
    first_name: "Sarah",
    last_name: "Connor",
    address_1: "123 Cyberdyne Ave",
    city: "Los Angeles",
    phone: "+1 555 987 6543",
  },
  items: [
    {
      id: "item_1",
      title: "Ergonomic Office Chair",
      variant_sku: "OC-101-BLACK-WHITE",
      quantity: 2,
      unit_price: 120,
      total: 240,
    },
    {
      id: "item_2",
      title: "Casual Hoodie",
      variant_sku: "MH-320 MH-320 MH",
      quantity: 1,
      unit_price: 50,
      total: 50,
    },
  ],
  subtotal: 290,
  discount_total: 25,
  shipping_total: 15,
  tax_total: 23.2,
  total: 353.2,
};

export const invoiceDummyData = {
  id: "inv_1",
  created_at: new Date(),
  display_number: 4234234,
};
