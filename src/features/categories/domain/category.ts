import type { EntityId } from "@/features/common/domain/pagination";

export interface Category {
  id: EntityId;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryInput {
  name: string;
  description: string;
}
