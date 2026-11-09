import { demoStore } from "@/features/common/demo/demoStore";
import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import { ApiError } from "@/features/common/http/apiError";
import { http, unwrapData } from "@/features/common/http/httpClient";
import type { Category, CategoryInput } from "../domain/category";

const BASE_PATH = "/api/categories";

export const categoryService = {
  /** Trae todas las categorías activas (se usan en filtros y formularios). */
  async list(): Promise<Category[]> {
    try {
      const response = await http.get<PaginatedResponse<Category> | Category[]>(BASE_PATH, {
        auth: false,
        query: { limit: 100 },
      });
      return Array.isArray(response) ? response : response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.listCategories();
      }
      throw error;
    }
  },

  async create(input: CategoryInput): Promise<Category> {
    try {
      return unwrapData(await http.post<Category | { data: Category }>(BASE_PATH, input));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.createCategory(input);
      }
      throw error;
    }
  },

  async update(id: EntityId, input: CategoryInput): Promise<Category> {
    try {
      return unwrapData(await http.put<Category | { data: Category }>(`${BASE_PATH}/${id}`, input));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.updateCategory(id, input);
      }
      throw error;
    }
  },

  async remove(id: EntityId): Promise<void> {
    try {
      await http.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        demoStore.removeCategory(id);
        return;
      }
      throw error;
    }
  },
};
