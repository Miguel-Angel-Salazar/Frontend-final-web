"use client";

import { useAsyncResource } from "@/features/common/hooks/useAsyncResource";
import { categoryService } from "../services/categoryService";

export function useCategories() {
  const { data, ...rest } = useAsyncResource(categoryService.list, "categories");
  return { categories: data ?? [], ...rest };
}
