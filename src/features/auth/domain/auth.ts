import type { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
