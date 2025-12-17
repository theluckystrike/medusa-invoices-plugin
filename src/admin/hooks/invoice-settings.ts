import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import {
  InvoiceSettingsRequestBody,
  InvoiceSettingsResponse,
} from "../../types/invoice-settings";

export const useUpsertInvoiceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceSettingsRequestBody) => {
      const invoiceSettings = await sdk.client.fetch<InvoiceSettingsResponse>(
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

export const useInvoiceSettings = (
  options?: Omit<
    UndefinedInitialDataOptions<
      InvoiceSettingsResponse,
      Error,
      InvoiceSettingsResponse,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => {
      const invoiceSettings = await sdk.client.fetch<InvoiceSettingsResponse>(
        `/admin/invoice-settings`,
      );

      return invoiceSettings;
    },
    ...options,
  });
};
