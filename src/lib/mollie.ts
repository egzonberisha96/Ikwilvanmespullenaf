import { createMollieClient } from "mollie-api-node";

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY ?? "test_placeholder",
});

export const SUBSCRIPTION_PRICES: Record<string, number> = {
  BASIS: 29,
  PRO: 79,
  UNLIMITED: 149,
};
