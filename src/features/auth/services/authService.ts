import { http, unwrapData } from "@/features/common/http/httpClient";
import { sessionStore } from "@/features/common/session/sessionStore";
import type { AuthPayload, LoginRequest, RegisterRequest } from "../domain/auth";
import type { User, UserRole } from "../domain/user";

/** El backend puede enviar el rol en minúsculas ("admin"); aquí se normaliza. */
function normalizeUser(user: User): User {
  const role = String(user.role).toUpperCase() as UserRole;
  return { ...user, role: role === "ADMIN" ? "ADMIN" : "USER" };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await http.post<AuthPayload | { data: AuthPayload }>("/api/auth/login", credentials, {
      auth: false,
    });
    const { user, token } = unwrapData(response);
    const normalizedUser = normalizeUser(user);
    sessionStore.save({ token, user: normalizedUser });
    return normalizedUser;
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await http.post<AuthPayload | { data: AuthPayload }>("/api/auth/register", data, {
      auth: false,
    });
    const { user, token } = unwrapData(response);
    const normalizedUser = normalizeUser(user);
    sessionStore.save({ token, user: normalizedUser });
    return normalizedUser;
  },

  logout: () => sessionStore.clear(),
};
