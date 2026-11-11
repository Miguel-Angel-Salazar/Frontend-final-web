"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryManager } from "@/features/categories/components/CategoryManager";
import { Button, ButtonLink } from "@/features/common/components/Button";
import { ConfirmDialog } from "@/features/common/components/ConfirmDialog";
import { Icon } from "@/features/common/components/Icon";
import { PaginationBar } from "@/features/common/components/PaginationBar";
import { EmptyState, ErrorState, InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import { getErrorMessage } from "@/features/common/http/apiError";
import { cn, formatPrice } from "@/features/common/utils/format";
import { AdminOrdersManager } from "@/features/orders/components/AdminOrdersManager";
import { platformLabel, type Product, type ProductFilters } from "../domain/product";
import { useProducts } from "../hooks/useProducts";
import { ProductImage } from "./ProductImage";

type AdminTab = "products" | "categories" | "orders";

const INITIAL_FILTERS: ProductFilters = {
  page: 1,
  limit: 8,
  search: "",
  categoryId: "",
  platform: "",
  minPrice: "",
  maxPrice: "",
};

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("products");
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);
  const { products, pagination, isLoading, error, reload, removeProduct } = useProducts(filters);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await removeProduct(target.id);
      setDeleteSuccess(`Producto «${target.name}» eliminado del catálogo.`);
      reload();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Secciones de administración"
          className="inline-flex flex-wrap gap-2 rounded-full border-2 border-ink bg-surface p-1.5"
        >
          {(
            [
              { id: "products", label: "Productos" },
              { id: "categories", label: "Categorías" },
              { id: "orders", label: "Pedidos" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition",
                tab === item.id ? "bg-ink text-paper" : "hover:bg-surface-soft",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <ButtonLink href="/admin/productos/nuevo">
            <Icon name="plus" size={18} />
            Nuevo producto
          </ButtonLink>
        )}
      </div>

      {tab === "products" && (
        <div className="space-y-6">
          {deleteError && <InlineAlert message={deleteError} onDismiss={() => setDeleteError(null)} />}
          {deleteSuccess && (
            <InlineAlert tone="success" message={deleteSuccess} onDismiss={() => setDeleteSuccess(null)} />
          )}

          <div className="max-w-md">
            <label htmlFor="admin-product-search" className="sr-only">
              Buscar producto en inventario
            </label>
            <div className="relative">
              <Icon
                name="search"
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="admin-product-search"
                type="search"
                placeholder="Filtrar productos por nombre..."
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })}
                className="h-11 w-full rounded-full border-2 border-line bg-surface pl-11 pr-4 text-sm text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingState label="Cargando inventario..." />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No hay productos para mostrar"
              description="Publica un nuevo producto con su imagen para que aparezca en la tienda."
              action={<ButtonLink href="/admin/productos/nuevo">Crear producto</ButtonLink>}
            />
          ) : (
            <>
              <ul className="grid gap-4">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-col justify-between gap-4 rounded-[1.8rem_1.8rem_1.8rem_0.6rem] border-2 border-ink bg-surface p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        sizes="96px"
                        className="size-16 shrink-0 rounded-2xl"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                          <span className="rounded-full bg-surface-soft px-2.5 py-0.5">
                            {platformLabel(product.platform)}
                          </span>
                          {product.category && <span>· {product.category.name}</span>}
                          <span>· Stock: {product.stock}</span>
                        </div>
                        <Link
                          href={`/catalogo/${product.id}`}
                          className="font-display text-lg font-bold hover:text-coral"
                        >
                          {product.name}
                        </Link>
                        <p className="font-display text-sm font-extrabold text-coral">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <ButtonLink
                        href={`/admin/productos/${product.id}/editar`}
                        variant="ghost"
                        size="sm"
                      >
                        <Icon name="edit" size={16} />
                        Editar
                      </ButtonLink>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(product)}>
                        <Icon name="trash" size={16} />
                        Eliminar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              {pagination && (
                <PaginationBar
                  pagination={pagination}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              )}
            </>
          )}

          <ConfirmDialog
            isOpen={Boolean(deleteTarget)}
            title="¿Eliminar este producto?"
            confirmLabel="Sí, eliminar producto"
            isProcessing={isDeleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          >
            <p>
              El producto <strong>{deleteTarget?.name}</strong> dejará de mostrarse en el catálogo de la tienda.
            </p>
          </ConfirmDialog>
        </div>
      )}

      {tab === "categories" && <CategoryManager />}
      {tab === "orders" && <AdminOrdersManager />}
    </div>
  );
}
