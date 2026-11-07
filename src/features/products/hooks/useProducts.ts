"use client";

import { useCallback } from "react";
import type { EntityId } from "@/features/common/domain/pagination";
import { useAsyncResource } from "@/features/common/hooks/useAsyncResource";
import type { ProductFilters } from "../domain/product";
import { productService } from "../services/productService";

export function useProducts(filters: ProductFilters) {
  const loader = useCallback(() => productService.list(filters), [filters]);
  const { data, ...rest } = useAsyncResource(loader, JSON.stringify(filters));
  return {
    products: data?.data ?? [],
    pagination: data?.pagination,
    ...rest,
  };
}

export function useProduct(id: EntityId) {
  const loader = useCallback(() => productService.getById(id), [id]);
  const { data, ...rest } = useAsyncResource(loader, `product-${id}`);
  return { product: data, ...rest };
}
