import { demoStore } from "@/features/common/demo/demoStore";
import { ApiError } from "@/features/common/http/apiError";
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
    try {
      const response = await http.post<AuthPayload | { data: AuthPayload }>("/api/auth/login", credentials, {
        auth: false,
      });
      const { user, token } = unwrapData(response);
      const normalizedUser = normalizeUser(user);
      sessionStore.save({ token, user: normalizedUser });
      return normalizedUser;
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        try {
          const user = demoStore.authenticateUser(credentials.email, credentials.password);
          sessionStore.save({ token: "demo-jwt-token", user });
          return user;
        } catch {
          throw new ApiError("Credenciales inválidas. Verifica tu correo y contraseña.", 401);
        }
      }
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<User> {
    try {
      const response = await http.post<AuthPayload | { data: AuthPayload }>("/api/auth/register", data, {
        auth: false,
      });
      const { user, token } = unwrapData(response);
      const normalizedUser = normalizeUser(user);
      sessionStore.save({ token, user: normalizedUser });
      return normalizedUser;
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        try {
          const user = demoStore.registerUser(data.name, data.email, data.password);
          sessionStore.save({ token: "demo-jwt-token", user });
          return user;
        } catch {
          throw new ApiError("Este correo electrónico ya está registrado.", 409);
        }
      }
      throw error;
    }
  },

  logout: () => sessionStore.clear(),
};
