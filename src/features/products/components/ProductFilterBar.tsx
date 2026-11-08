"use client";

import type { Category } from "@/features/categories/domain/category";
import { Button } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { cn } from "@/features/common/utils/format";
import { PLATFORMS, type ProductFilters } from "../domain/product";

interface ProductFilterBarProps {
  filters: ProductFilters;
  categories: Category[];
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
}

export function ProductFilterBar({ filters, categories, onChange, onReset }: ProductFilterBarProps) {
  const hasActiveFilters = Boolean(
    filters.search || filters.categoryId || filters.platform || filters.minPrice || filters.maxPrice,
  );

  return (
    <section
      aria-label="Filtros del catálogo"
      className="rounded-[2.2rem_2.2rem_2.2rem_0.7rem] border-2 border-ink bg-surface p-5 shadow-[6px_6px_0_0_var(--ink)] sm:p-6"
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_0.9fr_0.9fr]">
        <div>
          <label htmlFor="catalog-search" className="mb-1.5 block pl-1 text-xs font-bold uppercase tracking-wider text-muted">
            Buscar por nombre o descripción
          </label>
          <div className="relative">
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="catalog-search"
              type="search"
              placeholder="Ej: Zelda, DualSense, Elden Ring..."
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value, page: 1 })}
              className="h-11 w-full rounded-full border-2 border-line bg-paper pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="catalog-category" className="mb-1.5 block pl-1 text-xs font-bold uppercase tracking-wider text-muted">
            Categoría
          </label>
          <select
            id="catalog-category"
            value={filters.categoryId}
            onChange={(event) => onChange({ categoryId: event.target.value, page: 1 })}
            className="h-11 w-full cursor-pointer rounded-full border-2 border-line bg-paper px-4 text-sm text-ink focus:border-violet focus:outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="catalog-min-price" className="mb-1.5 block pl-1 text-xs font-bold uppercase tracking-wider text-muted">
            Precio mínimo (COP)
          </label>
          <input
            id="catalog-min-price"
            type="number"
            min={0}
            step={10000}
            placeholder="0"
            value={filters.minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value, page: 1 })}
            className="h-11 w-full rounded-full border-2 border-line bg-paper px-4 text-sm text-ink focus:border-violet focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="catalog-max-price" className="mb-1.5 block pl-1 text-xs font-bold uppercase tracking-wider text-muted">
            Precio máximo (COP)
          </label>
          <input
            id="catalog-max-price"
            type="number"
            min={0}
            step={10000}
            placeholder="Sin tope"
            value={filters.maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value, page: 1 })}
            className="h-11 w-full rounded-full border-2 border-line bg-paper px-4 text-sm text-ink focus:border-violet focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-line pt-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por plataforma">
          <button
            type="button"
            onClick={() => onChange({ platform: "", page: 1 })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold transition",
              filters.platform === "" ? "bg-ink text-paper" : "bg-surface-soft text-ink hover:bg-lime/50",
            )}
          >
            Todas las plataformas
          </button>
          {PLATFORMS.map((platform) => {
            const active = filters.platform === platform.value;
            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => onChange({ platform: active ? "" : platform.value, page: 1 })}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition",
                  active ? "bg-coral text-white" : "bg-surface-soft text-ink hover:bg-lime/50",
                )}
              >
                {platform.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
