import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import {
  GenerateInvoiceRequestBody,
  GetInvoiceResponse,
  GetInvoicesResponse,
  InvoiceDTO,
} from "../../types/invoice";

export type UseOrderInvoicesParams = {
  limit?: number;
  offset?: number;
  filters?: {
    created_by_event?: string[];
    status?: string[];
    template_version?: string[];
  };
};

export const useOrderInvoices = (
  orderId: string,
  params: UseOrderInvoicesParams,
  options?: Omit<
    UndefinedInitialDataOptions<
      GetInvoicesResponse,
      Error,
      GetInvoicesResponse,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["order-invoices", orderId, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.limit !== undefined)
        searchParams.set("limit", String(params.limit));
      if (params.offset !== undefined)
        searchParams.set("offset", String(params.offset));

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, values]) => {
          values?.forEach((v) => searchParams.append(`${key}[]`, v));
        });
      }

      const queryString = searchParams.toString();

      const invoices = await sdk.client.fetch<GetInvoicesResponse>(
        `/admin/invoices/${orderId}${queryString ? `?${queryString}` : ""}`,
      );

      return invoices;
    },
    enabled: !!orderId,
    ...options,
  });
};

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
    queryKey: ["recent-invoice", orderId],
    queryFn: async () => {
      const invoice = await sdk.client.fetch<GetInvoiceResponse>(
        `/admin/invoices/${orderId}/recent`,
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
    mutationFn: async (payload: GenerateInvoiceRequestBody) => {
      const invoice = await sdk.client.fetch<InvoiceDTO>(
        `/admin/invoices/${order_id}/generate`,
        {
          method: "POST",
          body: payload,
        },
      );

      return invoice;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recent-invoice", order_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-invoices", order_id],
      });
    },
  });
};
