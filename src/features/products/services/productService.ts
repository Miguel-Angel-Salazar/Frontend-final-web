import type { EntityId, PaginatedResponse } from "@/features/common/domain/pagination";
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
  list(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    return http.get<PaginatedResponse<Product>>(BASE_PATH, { auth: false, query: { ...filters } });
  },

  async getById(id: EntityId): Promise<Product> {
    return unwrapData(await http.get<ProductResponse>(`${BASE_PATH}/${id}`, { auth: false }));
  },

  async create(input: ProductInput, image: File | null): Promise<Product> {
    return unwrapData(await http.post<ProductResponse>(BASE_PATH, toFormData(input, image)));
  },

  async update(id: EntityId, input: ProductInput, image: File | null): Promise<Product> {
    return unwrapData(await http.put<ProductResponse>(`${BASE_PATH}/${id}`, toFormData(input, image)));
  },

  /** Borrado lógico: el backend marca el producto como inactivo. */
  remove(id: EntityId): Promise<void> {
    return http.delete(`${BASE_PATH}/${id}`);
  },
};
