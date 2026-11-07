export type UserRole = "ADMIN" | "USER";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}
