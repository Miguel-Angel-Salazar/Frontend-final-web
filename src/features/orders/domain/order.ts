import type { User } from "@/features/auth/domain/user";
import type { EntityId } from "@/features/common/domain/pagination";
import type { Product } from "@/features/products/domain/product";

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pendiente", tone: "sun" },
  { value: "SHIPPED", label: "Enviado", tone: "sky" },
  { value: "DELIVERED", label: "Entregado", tone: "lime" },
  { value: "CANCELLED", label: "Cancelado", tone: "coral" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export interface OrderItem {
  id: EntityId;
  productId: EntityId;
  quantity: number;
  unitPrice: number | string;
  product?: Pick<Product, "id" | "name" | "imageUrl" | "platform">;
}

export interface Order {
  id: EntityId;
  userId: EntityId;
  productId?: EntityId;
  quantity?: number;
  total: number | string;
  status: OrderStatus;
  shippingAddress?: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "email">;
  product?: Pick<Product, "id" | "name" | "imageUrl" | "platform">;
  items?: OrderItem[];
}

export interface CreateOrderInput {
  productId: EntityId;
  quantity: number;
  shippingAddress: string;
}

export function orderStatusMeta(status: string) {
  return (
    ORDER_STATUSES.find((item) => item.value === status) ?? {
      value: status,
      label: status,
      tone: "sun" as const,
    }
  );
}
