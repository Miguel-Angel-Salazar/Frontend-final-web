const rawApiHost = process.env.NEXT_PUBLIC_API_HOST ?? "";

/** URL base de la API sin la barra final. Se define en NEXT_PUBLIC_API_HOST. */
export const API_HOST = rawApiHost.replace(/\/+$/, "");

export const STORAGE_KEYS = {
  token: "respawn_token",
  user: "respawn_user",
  theme: "respawn_theme",
} as const;

export const DEFAULT_PAGE_SIZE = 9;
