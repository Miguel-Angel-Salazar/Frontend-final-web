"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button, ButtonLink } from "@/features/common/components/Button";
import { TextField } from "@/features/common/components/FormFields";
import { Icon } from "@/features/common/components/Icon";
import { EmptyState, ErrorState, InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import type { EntityId } from "@/features/common/domain/pagination";
import { getErrorMessage } from "@/features/common/http/apiError";
import { formatPrice } from "@/features/common/utils/format";
import { orderService } from "@/features/orders/services/orderService";
import { platformLabel } from "../domain/product";
import { useProduct } from "../hooks/useProducts";
import { ProductImage } from "./ProductImage";

export function ProductDetailView({ id }: { id: EntityId }) {
  const router = useRouter();
  const { product, isLoading, error, reload } = useProduct(id);
  const { isAuthenticated, isAdmin } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  if (isLoading) return <LoadingState label="Cargando ficha del producto..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!product) {
    return (
      <EmptyState
        title="Producto no encontrado"
        description="Es posible que ya no esté disponible en el inventario."
        action={<ButtonLink href="/catalogo">Volver al catálogo</ButtonLink>}
      />
    );
  }

  const maxQuantity = Math.max(1, product.stock);
  const totalPrice = Number(product.price) * quantity;

  const handleOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shippingAddress.trim()) {
      setFormError("Indica una dirección o punto de entrega para el envío.");
      return;
    }

    setIsOrdering(true);
    setFormError(null);
    try {
      await orderService.create({
        productId: product.id,
        quantity,
        shippingAddress: shippingAddress.trim(),
      });
      router.push("/pedidos?created=1");
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-8 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink">
          <Icon name="arrowLeft" size={18} />
          Volver al catálogo
        </Link>

        {isAdmin && (
          <ButtonLink href={`/admin/productos/${product.id}/editar`} variant="ghost" size="sm">
            <Icon name="edit" size={16} />
            Editar producto
          </ButtonLink>
        )}
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative rounded-[2.6rem_0.9rem_2.6rem_2.6rem] border-2 border-ink bg-surface p-5 shadow-[8px_8px_0_0_var(--ink)]">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] rounded-[2rem]"
          />
          <span className="absolute -top-4 left-6 -rotate-3 rounded-full border-2 border-ink bg-lime px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-[#17142b]">
            {platformLabel(product.platform)}
          </span>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            {product.category && (
              <span className="inline-block rounded-full bg-surface-soft px-3.5 py-1 text-xs font-bold text-muted">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
            <p className="font-display text-3xl font-extrabold text-coral">{formatPrice(product.price)}</p>
          </div>

          <p className="leading-relaxed text-muted">{product.description}</p>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-soft px-4 py-3 text-sm font-semibold">
            <Icon name="truck" size={20} className="text-violet" />
            {product.stock > 0 ? (
              <span>{product.stock} unidades listas para despacho inmediato</span>
            ) : (
              <span className="text-coral">Sin unidades disponibles por ahora</span>
            )}
          </div>

          <div className="rounded-[2rem_2rem_2rem_0.6rem] border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--ink)]">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">¿Listo para pedirlo?</h2>
                <p className="text-sm text-muted">
                  Inicia sesión o crea tu cuenta para encargar este producto y seguir el envío desde tu perfil.
                </p>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href={`/login?next=/catalogo/${product.id}`}>Iniciar sesión</ButtonLink>
                  <ButtonLink href="/register" variant="ghost">
                    Crear cuenta
                  </ButtonLink>
                </div>
              </div>
            ) : product.stock <= 0 ? (
              <p className="text-sm font-semibold text-coral">
                Este artículo está agotado temporalmente. Revisa más tarde o explora otros títulos del catálogo.
              </p>
            ) : (
              <form onSubmit={handleOrder} noValidate className="space-y-4">
                <h2 className="font-display text-xl font-bold">Hacer pedido</h2>
                {formError && <InlineAlert message={formError} />}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold">Cantidad</span>
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="grid size-8 place-items-center rounded-full font-bold hover:bg-surface-soft"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-display font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                      className="grid size-8 place-items-center rounded-full font-bold hover:bg-surface-soft"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                <TextField
                  label="Dirección de entrega"
                  name="shippingAddress"
                  placeholder="Cra 45 # 12-34, Medellín (Apto 301)"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                />

                <div className="flex items-center justify-between border-t-2 border-dashed border-line pt-4">
                  <span className="text-sm font-semibold text-muted">Total estimado</span>
                  <span className="font-display text-2xl font-extrabold">{formatPrice(totalPrice)}</span>
                </div>

                <Button type="submit" size="lg" className="w-full" isLoading={isOrdering}>
                  <Icon name="bag" size={18} />
                  Confirmar pedido
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
