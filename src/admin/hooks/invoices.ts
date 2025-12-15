import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

export type AdminInvoice = {
  id: string;
  is_active: boolean;
  number: string | null;
  pdf_url: string | null;
  created_at: string;
};

export const useOrderInvoice = (
  orderId: string,
  options?: Omit<
    UndefinedInitialDataOptions<
      AdminInvoice,
      Error,
      AdminInvoice,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["active-invoice", orderId],
    queryFn: async () => {
      const invoice = await sdk.client.fetch<AdminInvoice>(
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
      const invoice = await sdk.client.fetch<AdminInvoice>(
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
