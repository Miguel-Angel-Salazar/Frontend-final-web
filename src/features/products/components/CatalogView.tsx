"use client";

import { useState } from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Button } from "@/features/common/components/Button";
import { PaginationBar } from "@/features/common/components/PaginationBar";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/StateMessages";
import { DEFAULT_PAGE_SIZE } from "@/features/common/config/env";
import type { ProductFilters } from "../domain/product";
import { useProducts } from "../hooks/useProducts";
import { ProductFilterBar } from "./ProductFilterBar";
import { ProductGrid } from "./ProductGrid";

const INITIAL_FILTERS: ProductFilters = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  search: "",
  categoryId: "",
  platform: "",
  minPrice: "",
  maxPrice: "",
};

export function CatalogView() {
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);
  const { categories } = useCategories();
  const { products, pagination, isLoading, error, reload } = useProducts(filters);

  const updateFilters = (patch: Partial<ProductFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="space-y-10">
      <ProductFilterBar
        filters={filters}
        categories={categories}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      {isLoading ? (
        <LoadingState label="Consultando el inventario..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No encontramos resultados"
          description="Prueba con otro término de búsqueda o limpia los filtros activos."
          action={
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Ver todo el catálogo
            </Button>
          }
        />
      ) : (
        <>
          <ProductGrid products={products} />
          {pagination && (
            <PaginationBar
              pagination={pagination}
              onPageChange={(page) => updateFilters({ page })}
            />
          )}
        </>
      )}
    </div>
  );
}
