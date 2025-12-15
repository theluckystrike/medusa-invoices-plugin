import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import {
  AdminOrderFilters,
  AdminOrderListResponse,
  AdminOrderResponse,
  SelectParams,
} from "@medusajs/framework/types";
import { sdk } from "../lib/sdk";

export const useOrders = (
  queryParams?: AdminOrderFilters,
  options?: Omit<
    UndefinedInitialDataOptions<
      AdminOrderListResponse,
      Error,
      AdminOrderListResponse,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["orders", JSON.stringify(queryParams)],
    queryFn: () => {
      return sdk.admin.order.list(queryParams);
    },
    ...options,
  });
};

export const useOrder = (
  id: string,
  queryParams?: SelectParams,
  options?: Omit<
    UndefinedInitialDataOptions<
      AdminOrderResponse,
      Error,
      AdminOrderResponse,
      (string | undefined)[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["order", id, JSON.stringify(queryParams)],
    queryFn: () => {
      return sdk.admin.order.retrieve(id, queryParams);
    },
    ...options,
  });
};
