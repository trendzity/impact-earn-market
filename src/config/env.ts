import {
  buildMissingApiUrlMessage,
  ENV_VAR_ALLOW_PRODUCTION_API,
  ENV_VAR_API_URL,
  ENV_VAR_DEV_API_URL,
  isKnownProductionApiHost,
  LOCAL_DEV_API_DEFAULT,
} from "@/config/env.shared";

export type EnvResolveResult =
  | { ok: true; apiBaseUrl: string }
  | { ok: false; message: string };

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function parseHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isLocalApiHost(url: string): boolean {
  const hostname = parseHostname(url);
  if (!hostname) return false;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function validateApiUrlFormat(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return `${ENV_VAR_API_URL} cannot be empty.`;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return `${ENV_VAR_API_URL} must be a valid URL (received: "${trimmed}").`;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return `${ENV_VAR_API_URL} must use http:// or https:// (received: "${parsed.protocol}").`;
  }

  return null;
}

function allowProductionApiInNonProd(): boolean {
  return import.meta.env[ENV_VAR_ALLOW_PRODUCTION_API] === "true";
}

function isNonProductionRuntime(): boolean {
  if (import.meta.env.DEV) return true;
  const mode = import.meta.env.MODE;
  return mode === "staging" || mode === "preview" || mode === "test";
}

function validateNonProdApiSafety(url: string): string | null {
  if (!isNonProductionRuntime()) return null;
  if (!isKnownProductionApiHost(url)) return null;
  if (allowProductionApiInNonProd()) return null;

  const context = import.meta.env.DEV ? "local development" : `mode "${import.meta.env.MODE}"`;

  return [
    `Refusing to use production API (${url}) during ${context}.`,
    "This prevents local/staging builds from mutating production data.",
    `Set ${ENV_VAR_ALLOW_PRODUCTION_API}=true only if you intentionally need production (not recommended).`,
    `Otherwise point ${ENV_VAR_API_URL} at a local or staging backend.`,
  ].join(" ");
}

export function resolveApiBaseUrl(): EnvResolveResult {
  const explicit = import.meta.env[ENV_VAR_API_URL]?.trim();
  const mode = import.meta.env.MODE;

  if (explicit) {
    const formatError = validateApiUrlFormat(explicit);
    if (formatError) return { ok: false, message: formatError };

    const safetyError = validateNonProdApiSafety(explicit);
    if (safetyError) return { ok: false, message: safetyError };

    return { ok: true, apiBaseUrl: normalizeBaseUrl(explicit) };
  }

  if (import.meta.env.DEV) {
    const devDefault =
      import.meta.env[ENV_VAR_DEV_API_URL]?.trim() || LOCAL_DEV_API_DEFAULT;

    const formatError = validateApiUrlFormat(devDefault);
    if (formatError) {
      return {
        ok: false,
        message: `${ENV_VAR_DEV_API_URL || "dev default"} is invalid: ${formatError}`,
      };
    }

    if (!isLocalApiHost(devDefault)) {
      return {
        ok: false,
        message: [
          `Dev API URL must be localhost (${devDefault} is not allowed).`,
          `Set ${ENV_VAR_DEV_API_URL} or ${ENV_VAR_API_URL} to http://localhost:<port>/api`,
        ].join(" "),
      };
    }

    console.warn(
      `[env] ${ENV_VAR_API_URL} is not set; using local dev API: ${devDefault}`
    );

    return { ok: true, apiBaseUrl: normalizeBaseUrl(devDefault) };
  }

  return { ok: false, message: buildMissingApiUrlMessage(mode) };
}

const resolved = resolveApiBaseUrl();

/** Set when API URL configuration is invalid; blocks app bootstrap in `main.tsx`. */
export const ENV_CONFIG_ERROR: string | null = resolved.ok ? null : resolved.message;

/** Resolved API base URL (includes `/api` suffix). Empty when configuration failed. */
export const API_BASE_URL: string = resolved.ok ? resolved.apiBaseUrl : "";

export function getEnvConfigError(): string | null {
  return ENV_CONFIG_ERROR;
}
