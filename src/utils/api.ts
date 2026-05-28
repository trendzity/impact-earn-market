import { getApiUrl, getToken, logout } from "@/utils/auth";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  /**
   * If true, attaches `Authorization: Bearer <token>` when token exists.
   * Defaults to true.
   */
  auth?: boolean;
  headers?: HeadersInit;
  /**
   * If true, redirects to `/login` on 401/403.
   * Defaults to true.
   */
  redirectOnAuthError?: boolean;
};

async function safeParseJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function handleAuthFailure(redirectTo: string) {
  logout();
  try {
    window.dispatchEvent(new Event("user-updated"));
  } catch {
    // ignore
  }
  // Use a hard redirect to reset any in-memory state.
  window.location.href = redirectTo;
}

/**
 * Centralized API client.
 *
 * - Builds URLs using `getApiUrl()`
 * - Injects Bearer auth by default
 * - On 401/403: logs out and redirects to `/login` (configurable)
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<{ ok: true; data: T; response: Response } | { ok: false; error: string; status: number; response: Response; data?: any }> {
  const {
    auth = true,
    redirectOnAuthError = true,
    headers,
    ...init
  } = options;

  const token = auth ? getToken() : null;

  const mergedHeaders: HeadersInit = {
  
...(init.body instanceof FormData
  ? {}
  : { "Content-Type": "application/json" }),
  
  ...(headers || {}),

  ...(token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}),
};

 let res: Response;

try {
  res = await fetch(getApiUrl(endpoint), {
    ...init,
    headers: mergedHeaders,
  });
} catch (error) {
  return {
    ok: false,
    status: 0,
    error: "Network error. Please check your connection and try again.",
    response: new Response(),
  };
}
  const body = await safeParseJson(res);

  if (res.status === 401 ||) {
    if (redirectOnAuthError) {
      handleAuthFailure("/login");
    }
    return {
      ok: false,
      status: res.status,
      error: (body && (body.message || body.error)) || "Unauthorized",
      response: res,
      data: body ?? undefined,
    };
  }
if (res.status === 403) {
  return {
    ok: false,
    status: res.status,
    error: "Access denied",
    response: res,
    data: body ?? undefined,
  };
}

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: (body && (body.message || body.error)) || `Request failed (${res.status})`,
      response: res,
      data: body ?? undefined,
    };
  }

  return { ok: true, data: body as T, response: res };
}

