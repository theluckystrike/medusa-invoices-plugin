import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl:
    (typeof __BACKEND_URL__ !== "undefined" ? __BACKEND_URL__ : undefined) ||
    "http://localhost:9000",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
});
