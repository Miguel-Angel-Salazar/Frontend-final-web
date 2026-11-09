import { demoStore } from "@/features/common/demo/demoStore";
import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import { ApiError } from "@/features/common/http/apiError";
import { http, unwrapData } from "@/features/common/http/httpClient";
import { sessionStore } from "@/features/common/session/sessionStore";
import type { CreateOrderInput, Order, OrderStatus } from "../domain/order";

const BASE_PATH = "/api/orders";

type OrderListResponse = PaginatedResponse<Order> | { data: Order[] } | Order[];
type SingleOrderResponse = Order | { data: Order };

function unwrapOrderList(response: OrderListResponse): Order[] {
  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

export const orderService = {
  async list(): Promise<Order[]> {
    try {
      const response = await http.get<OrderListResponse>(BASE_PATH, { query: { limit: 50 } });
      return unwrapOrderList(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.listOrders();
      }
      throw error;
    }
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const payload = {
      ...input,
      items: [{ productId: input.productId, quantity: input.quantity }],
    };
    try {
      return unwrapData(await http.post<SingleOrderResponse>(BASE_PATH, payload));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        const currentUser = sessionStore.getSnapshot()?.user ?? null;
        return demoStore.createOrder(input, currentUser);
      }
      throw error;
    }
  },

  async updateStatus(id: EntityId, status: OrderStatus): Promise<Order> {
    try {
      return unwrapData(await http.put<SingleOrderResponse>(`${BASE_PATH}/${id}`, { status }));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.updateOrderStatus(id, status);
      }
      throw error;
    }
  },

  /** Cancela o elimina lógicamente el pedido. */
  async remove(id: EntityId): Promise<void> {
    try {
      await http.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        demoStore.removeOrder(id);
        return;
      }
      throw error;
    }
  },
};
