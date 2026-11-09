import { demoStore } from "@/features/common/demo/demoStore";
import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
import { ApiError } from "@/features/common/http/apiError";
import { http, unwrapData } from "@/features/common/http/httpClient";
import type { Product, ProductFilters, ProductInput } from "../domain/product";

const BASE_PATH = "/api/products";

type ProductResponse = Product | { data: Product };

/** El producto se envía como multipart para poder adjuntar la imagen (campo "image"). */
function toFormData(input: ProductInput, image: File | null): FormData {
  const formData = new FormData();
  formData.append("name", input.name.trim());
  formData.append("description", input.description.trim());
  formData.append("price", input.price);
  formData.append("stock", input.stock);
  formData.append("platform", input.platform);
  formData.append("categoryId", input.categoryId);
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const productService = {
  async list(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      return await http.get<PaginatedResponse<Product>>(BASE_PATH, { auth: false, query: { ...filters } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.listProducts(filters);
      }
      throw error;
    }
  },

  async getById(id: EntityId): Promise<Product> {
    try {
      return unwrapData(await http.get<ProductResponse>(`${BASE_PATH}/${id}`, { auth: false }));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.getProductById(id);
      }
      throw error;
    }
  },

  async create(input: ProductInput, image: File | null): Promise<Product> {
    try {
      return unwrapData(await http.post<ProductResponse>(BASE_PATH, toFormData(input, image)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.createProduct(input, image);
      }
      throw error;
    }
  },

  async update(id: EntityId, input: ProductInput, image: File | null): Promise<Product> {
    try {
      return unwrapData(await http.put<ProductResponse>(`${BASE_PATH}/${id}`, toFormData(input, image)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        return demoStore.updateProduct(id, input, image);
      }
      throw error;
    }
  },

  /** Borrado lógico: el backend marca el producto como inactivo. */
  async remove(id: EntityId): Promise<void> {
    try {
      await http.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        demoStore.removeProduct(id);
        return;
      }
      throw error;
    }
  },
};
