import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { GetInvoiceResponse, InvoiceDTO } from "../../types/invoice";

export const useOrderInvoice = (
  orderId: string,
  options?: Omit<
    UndefinedInitialDataOptions<
      GetInvoiceResponse,
      Error,
      GetInvoiceResponse,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["active-invoice", orderId],
    queryFn: async () => {
      const invoice = await sdk.client.fetch<GetInvoiceResponse>(
        `/admin/invoices/${orderId}`,
      );

      return invoice;
    },
    enabled: !!orderId,
    ...options,
  });
};

export const useGenerateInvoice = (order_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const invoice = await sdk.client.fetch<InvoiceDTO>(
        `/admin/invoices/${order_id}/generate`,
        {
          method: "POST",
        },
      );

      return invoice;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-invoice", order_id],
      });
    },
  });
};
