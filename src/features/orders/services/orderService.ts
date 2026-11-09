import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import { http, unwrapData } from "@/features/common/http/httpClient";
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
    const response = await http.get<OrderListResponse>(BASE_PATH, { query: { limit: 50 } });
    return unwrapOrderList(response);
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const payload = {
      ...input,
      items: [{ productId: input.productId, quantity: input.quantity }],
    };
    return unwrapData(await http.post<SingleOrderResponse>(BASE_PATH, payload));
  },

  async updateStatus(id: EntityId, status: OrderStatus): Promise<Order> {
    return unwrapData(await http.put<SingleOrderResponse>(`${BASE_PATH}/${id}`, { status }));
  },

  /** Cancela o elimina lógicamente el pedido. */
  async remove(id: EntityId): Promise<void> {
    await http.delete(`${BASE_PATH}/${id}`);
  },
};
