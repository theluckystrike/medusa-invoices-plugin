import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

export type InvoiceSettingsPayload = {
  style?: "clean" | "classic" | "compact";
  header_type?: "heading" | "image" | "none";
  image_url?: string | null;
  header_text?: string | null;
  additional_header_content?: Record<string, any> | null;
  additional_footer_content?: Record<string, any> | null;
  business?: {
    name: string;
    address: string;
    tax_id: string;
    iban: string;
    swift: string;
  };
  auto_order_completed?: boolean;
  auto_payment_captured?: boolean;
  auto_fullfillment_created?: boolean;
};

export const useUpsertInvoiceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceSettingsPayload) => {
      const invoiceSettings = await sdk.client.fetch<InvoiceSettingsPayload>(
        `/admin/invoice-settings`,
        {
          method: "PUT",
          body: payload,
        },
      );

      return invoiceSettings;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoice-settings"],
      });
    },
  });
};
