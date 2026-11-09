import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import { http, unwrapData } from "@/features/common/http/httpClient";
import type { Category, CategoryInput } from "../domain/category";

const BASE_PATH = "/api/categories";

export const categoryService = {
  /** Trae todas las categorías activas (se usan en filtros y formularios). */
  async list(): Promise<Category[]> {
    const response = await http.get<PaginatedResponse<Category> | Category[]>(BASE_PATH, {
      auth: false,
      query: { limit: 100 },
    });
    return Array.isArray(response) ? response : response.data;
  },

  async create(input: CategoryInput): Promise<Category> {
    return unwrapData(await http.post<Category | { data: Category }>(BASE_PATH, input));
  },

  async update(id: EntityId, input: CategoryInput): Promise<Category> {
    return unwrapData(await http.put<Category | { data: Category }>(`${BASE_PATH}/${id}`, input));
  },

  async remove(id: EntityId): Promise<void> {
    await http.delete(`${BASE_PATH}/${id}`);
  },
};
