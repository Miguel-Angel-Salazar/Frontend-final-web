"use client";

import { useState } from "react";
import { Button } from "@/features/common/components/Button";
import { ConfirmDialog } from "@/features/common/components/ConfirmDialog";
import { Icon } from "@/features/common/components/Icon";
import { EmptyState, ErrorState, InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import type { EntityId } from "@/features/common/domain/pagination";
import { getErrorMessage } from "@/features/common/http/apiError";
import { formatDate, formatPrice } from "@/features/common/utils/format";
import { ORDER_STATUSES, type Order, type OrderStatus } from "../domain/order";
import { useOrders } from "../hooks/useOrders";
import { orderService } from "../services/orderService";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function AdminOrdersManager() {
  const { orders, isLoading, error, reload } = useOrders();
  const [updatingId, setUpdatingId] = useState<EntityId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (orderId: EntityId, status: OrderStatus) => {
    setUpdatingId(orderId);
    setActionError(null);
    try {
      await orderService.updateStatus(orderId, status);
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await orderService.remove(deleteTarget.id);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingState label="Cargando pedidos de clientes..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="space-y-4">
      {actionError && <InlineAlert message={actionError} />}

      {orders.length === 0 ? (
        <EmptyState
          title="Sin pedidos registrados"
          description="Cuando los usuarios realicen compras en el catálogo aparecerán aquí."
        />
      ) : (
        <ul className="grid gap-4">
          {orders.map((order) => {
            const productName =
              order.product?.name ?? order.items?.[0]?.product?.name ?? `Pedido #${order.id}`;

            return (
              <li
                key={order.id}
                className="flex flex-col justify-between gap-4 rounded-[1.8rem_1.8rem_1.8rem_0.6rem] border-2 border-ink bg-surface p-5 sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs font-semibold text-muted">
                      #{order.id} · {formatDate(order.createdAt)}
                    </span>
                    {order.user && (
                      <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-semibold">
                        {order.user.name} ({order.user.email})
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold">{productName}</h3>
                  <p className="text-xs text-muted">
                    Total: <strong className="text-ink">{formatPrice(order.total)}</strong>
                    {order.shippingAddress ? ` · Dirección: ${order.shippingAddress}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label htmlFor={`status-${order.id}`} className="sr-only">
                    Estado del pedido #{order.id}
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                    className="h-10 cursor-pointer rounded-full border-2 border-line bg-paper px-4 text-xs font-bold text-ink focus:border-violet focus:outline-none disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(order)}>
                    <Icon name="trash" size={16} />
                    Eliminar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar este pedido?"
        confirmLabel="Sí, eliminar"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <p>
          Se quitará el pedido <strong>#{deleteTarget?.id}</strong> del listado activo.
        </p>
      </ConfirmDialog>
    </div>
  );
}
