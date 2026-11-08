"use client";

import { useAsyncResource } from "@/features/common/hooks/useAsyncResource";
import { orderService } from "../services/orderService";

export function useOrders() {
  const { data, ...rest } = useAsyncResource(orderService.list, "orders");
  return { orders: data ?? [], ...rest };
}
