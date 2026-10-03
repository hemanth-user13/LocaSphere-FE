import { config } from "../config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

type Query = Record<string, string | number | boolean | undefined | (string | number)[]>;

type RequestOptions = {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
};

// DRF speaks snake_case; the app speaks camelCase.
const toCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

function transformKeys(value: unknown, fn: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((v) => transformKeys(v, fn));
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [fn(k), transformKeys(v, fn)]),
    );
  }
  return value;
}

function buildQuery(query?: Query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(toSnake(key), String(v)));
    else params.append(toSnake(key), String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

let accessToken: string | null = null;

/** Thin fetch wrapper for the Django REST API (JWT bearer auth). */
export const apiClient = {
  setAccessToken(token: string | null) {
    accessToken = token;
  },

  async request<T>(method: string, path: string, { query, body, signal }: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);
    signal?.addEventListener("abort", () => controller.abort());

    try {
      const res = await fetch(`${config.apiBaseUrl}${path}${buildQuery(query)}`, {
        method,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(transformKeys(body, toSnake)) : undefined,
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        const detail = json && typeof json === "object" && "detail" in json ? String(json.detail) : res.statusText;
        throw new ApiError(detail || "Request failed", res.status, json);
      }
      return transformKeys(json, toCamel) as T;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("Unable to reach LocaSphere. Check your connection and try again.", 0, err);
    } finally {
      clearTimeout(timeout);
    }
  },

  get<T>(path: string, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("GET", path, options);
  },
  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("POST", path, { ...options, body });
  },
  patch<T>(path: string, body?: unknown) {
    return this.request<T>("PATCH", path, { body });
  },
  delete<T = void>(path: string) {
    return this.request<T>("DELETE", path);
  },
};
