import type { Category } from "@/features/categories/domain/category";
import type { EntityId } from "@/features/common/domain/pagination";

export const PLATFORMS = [
  { value: "PS5", label: "PlayStation 5" },
  { value: "XBOX", label: "Xbox Series" },
  { value: "SWITCH", label: "Nintendo Switch" },
  { value: "PC", label: "PC" },
  { value: "MULTI", label: "Multiplataforma" },
] as const;

export type Platform = (typeof PLATFORMS)[number]["value"];

export interface Product {
  id: EntityId;
  name: string;
  description: string;
  /** Decimal en la base de datos: puede llegar como string. */
  price: number | string;
  stock: number;
  platform: Platform;
  imageUrl: string | null;
  isActive?: boolean;
  categoryId: EntityId;
  category?: Pick<Category, "id" | "name">;
  createdAt?: string;
}

export interface ProductFilters {
  page: number;
  limit: number;
  search: string;
  categoryId: string;
  platform: string;
  minPrice: string;
  maxPrice: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: string;
  stock: string;
  platform: Platform | "";
  categoryId: string;
}

export function platformLabel(value: string): string {
  return PLATFORMS.find((platform) => platform.value === value)?.label ?? value;
}
