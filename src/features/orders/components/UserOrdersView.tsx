"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/features/common/components/Button";
import { ConfirmDialog } from "@/features/common/components/ConfirmDialog";
import { Icon } from "@/features/common/components/Icon";
import { EmptyState, ErrorState, InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import { getErrorMessage } from "@/features/common/http/apiError";
import { formatDate, formatPrice } from "@/features/common/utils/format";
import type { Order } from "../domain/order";
import { useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";

function describeOrder(order: Order): { title: string; countLabel: string; productHref?: string } {
  if (order.product) {
    const qty = order.quantity ?? 1;
    return {
      title: order.product.name,
      countLabel: `${qty} ${qty === 1 ? "unidad" : "unidades"}`,
      productHref: `/catalogo/${order.product.id}`,
    };
  }
  const firstItem = order.items?.[0];
  if (firstItem?.product) {
    const extra = (order.items?.length ?? 1) - 1;
    return {
      title: extra > 0 ? `${firstItem.product.name} (+${extra})` : firstItem.product.name,
      countLabel: `${firstItem.quantity} ${firstItem.quantity === 1 ? "unidad" : "unidades"}`,
      productHref: `/catalogo/${firstItem.product.id}`,
    };
  }
  return {
    title: `Pedido #${order.id}`,
    countLabel: `${order.quantity ?? 1} artículo(s)`,
  };
}

export function UserOrdersView() {
  const searchParams = useSearchParams();
  const { orders, isLoading, error, reload, removeOrder } = useOrders();

  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const justCreated = searchParams.get("created") === "1";

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    setActionError(null);
    try {
      await removeOrder(orderToCancel.id);
      setOrderToCancel(null);
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <LoadingState label="Cargando tus pedidos..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      {justCreated && (
        <InlineAlert
          tone="success"
          message="¡Pedido registrado! Aquí puedes consultar su estado en cualquier momento."
        />
      )}
      {actionError && <InlineAlert message={actionError} />}

      {orders.length === 0 ? (
        <EmptyState
          title="Todavía no tienes pedidos"
          description="Explora el catálogo y encarga tu primer juego, consola o figura."
          action={<ButtonLink href="/catalogo">Ir al catálogo</ButtonLink>}
        />
      ) : (
        <ul className="grid gap-5">
          {orders.map((order) => {
            const summary = describeOrder(order);
            const canCancel = order.status === "PENDING";

            return (
              <li
                key={order.id}
                className="flex flex-col justify-between gap-4 rounded-[2rem_2rem_2rem_0.6rem] border-2 border-ink bg-surface p-6 shadow-[5px_5px_0_0_var(--ink)] sm:flex-row sm:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs font-semibold text-muted">
                      Pedido #{order.id} · {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {summary.productHref ? (
                    <Link
                      href={summary.productHref}
                      className="block font-display text-xl font-bold hover:text-coral"
                    >
                      {summary.title}
                    </Link>
                  ) : (
                    <h2 className="font-display text-xl font-bold">{summary.title}</h2>
                  )}

                  <p className="text-sm text-muted">
                    {summary.countLabel}
                    {order.shippingAddress ? ` · Envío a: ${order.shippingAddress}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="font-display text-2xl font-extrabold">{formatPrice(order.total)}</span>
                  {canCancel && (
                    <Button variant="danger" size="sm" onClick={() => setOrderToCancel(order)}>
                      <Icon name="trash" size={16} />
                      Cancelar pedido
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(orderToCancel)}
        title="¿Cancelar este pedido?"
        confirmLabel="Sí, cancelar pedido"
        isProcessing={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setOrderToCancel(null)}
      >
        <p>
          Se cancelará el pedido <strong>#{orderToCancel?.id}</strong> y las unidades volverán al inventario.
        </p>
      </ConfirmDialog>
    </div>
  );
}
