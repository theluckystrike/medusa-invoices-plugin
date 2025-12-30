export const orderDummyData = {
  id: "order_01DKF45RS7TH",
  display_id: 4234234,
  created_at: new Date(),
  billing_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "Soltanska 45b",
    city: "Split",
    phone: "+385 99 543 2345",
  },
  shipping_address: {
    first_name: "Jane",
    last_name: "Smith",
    address_1: "Vukovarska 25",
    city: "Split",
    phone: "+385 95 240 3052",
  },
  items: [
    {
      id: "item_1",
      title: "Premium Widget",
      variant_sku: "SKU123",
      quantity: 1,
      unit_price: 100,
      total: 100,
    },
    {
      id: "item_2",
      title: "Standard Service",
      variant_sku: "SKU4324",
      quantity: 4,
      unit_price: 54,
      total: 216,
    },
  ],
  subtotal: 316,
  discount_total: 10,
  shipping_total: 10,
  tax_total: 0,
  total: 316,
};

export const invoiceDummyData = {
  id: "inv_1",
  created_at: new Date(),
  display_number: 4234234,
};
