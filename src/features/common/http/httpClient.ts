import { API_HOST } from "../config/env";
import { sessionStore } from "../session/sessionStore";
import { ApiError } from "./apiError";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  /** Si es false no se envía el token (login, registro, catálogo público). */
  auth?: boolean;
}

interface ErrorBody {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string } | string>;
}

const NETWORK_ERROR = "No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.";
const SESSION_EXPIRED = "Tu sesión expiró. Inicia sesión otra vez.";

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_HOST}${path}`, typeof window === "undefined" ? undefined : window.location.origin);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const { message, error, errors } = body as ErrorBody;
    if (Array.isArray(errors) && errors.length > 0) {
      return errors.map((item) => (typeof item === "string" ? item : item.message)).filter(Boolean).join(". ");
    }
    if (message) return message;
    if (error) return error;
  }
  return `La solicitud falló (código ${status}).`;
}

function handleUnauthorized(): void {
  sessionStore.clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.assign(`/login?expired=1&next=${next}`);
  }
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => undefined);
  }
  return response.text().catch(() => undefined);
}

async function request<T>(method: HttpMethod, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  const { query, auth = true } = options;
  const headers = new Headers({ Accept: "application/json" });
  const token = auth ? sessionStore.getToken() : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), { method, headers, body: payload });
  } catch {
    throw new ApiError(NETWORK_ERROR, 0);
  }

  const parsed = await parseBody(response);

  if (response.status === 401 && token) {
    handleUnauthorized();
    throw new ApiError(SESSION_EXPIRED, 401);
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(parsed, response.status), response.status);
  }

  return parsed as T;
}

/** Cliente HTTP centralizado: agrega el token, normaliza errores y maneja el 401. */
export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, body, options),
  delete: <T = void>(path: string, options?: RequestOptions) => request<T>("DELETE", path, undefined, options),
};

/** Algunas respuestas vienen como `{ data: ... }` y otras directas; esto las unifica. */
export function unwrapData<T>(body: T | { data: T }): T {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}
