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
      title: "Casual Hoodie",
      variant_sku: "CH-320",
      quantity: 1,
      unit_price: 55,
      total: 55,
    },
    {
      id: "item_2",
      title: "Slim Fit Denim Jeans",
      variant_sku: "DJ-210",
      quantity: 1,
      unit_price: 75,
      total: 75,
    },
    {
      id: "item_3",
      title: "Leather Jacket",
      variant_sku: "LJ-501",
      quantity: 1,
      unit_price: 180,
      total: 180,
    },
    {
      id: "item_4",
      title: "High-top Sneakers",
      variant_sku: "HTS-410",
      quantity: 1,
      unit_price: 90,
      total: 90,
    },
  ],
  subtotal: 225,
  discount_total: 20,
  shipping_total: 15,
  tax_total: 18.5,
  total: 238.5,
};

export const invoiceDummyData = {
  id: "inv_1",
  created_at: new Date(),
  display_number: 9876543,
};
