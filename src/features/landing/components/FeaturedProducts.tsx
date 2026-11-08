"use client";

import { ButtonLink } from "@/features/common/components/Button";
import { EmptyState, ErrorState, LoadingState } from "@/features/common/components/StateMessages";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import type { ProductFilters } from "@/features/products/domain/product";
import { useProducts } from "@/features/products/hooks/useProducts";

const LATEST_FILTERS: ProductFilters = {
  page: 1,
  limit: 3,
  search: "",
  categoryId: "",
  platform: "",
  minPrice: "",
  maxPrice: "",
};

export function FeaturedProducts() {
  const { products, isLoading, error, reload } = useProducts(LATEST_FILTERS);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
      <div className="mb-10 space-y-2">
        <p className="font-semibold text-coral">Recién llegados</p>
        <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Lo nuevo en la tienda</h2>
      </div>
      {isLoading && products.length === 0 ? (
        <LoadingState label="Buscando lo más nuevo..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : products.length === 0 ? (
        <EmptyState title="Aún no hay productos" description="Muy pronto llegarán los primeros juegos y consolas." />
      ) : (
        <>
          <ProductGrid products={products} />
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/catalogo" variant="secondary">
              Ver más productos
            </ButtonLink>
          </div>
        </>
      )}
    </section>
  );
}
