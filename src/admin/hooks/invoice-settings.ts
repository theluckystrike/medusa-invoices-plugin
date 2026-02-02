import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import {
  GetInvoiceSettingsResponse,
  InvoiceSettingsDTO,
  InvoiceSettingsRequestBody,
} from "../../types/invoice-settings";
import { FetchError } from "@medusajs/js-sdk"

export const useUpsertInvoiceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceSettingsRequestBody) => {
      const invoiceSettings = await sdk.client.fetch<InvoiceSettingsDTO>(
        `/admin/invoice-settings`,
        {
          method: "POST",
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
      GetInvoiceSettingsResponse,
      FetchError,
      GetInvoiceSettingsResponse,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => {
      const invoiceSettings =
        await sdk.client.fetch<GetInvoiceSettingsResponse>(
          `/admin/invoice-settings`,
        );

      return invoiceSettings;
    },
    ...options,
  });
};
