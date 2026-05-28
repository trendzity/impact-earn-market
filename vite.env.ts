import {
  buildMissingApiUrlMessage,
  ENV_VAR_API_URL,
  isKnownProductionApiHost,
} from "./src/config/env.shared";

type BuildEnvInput = {
  mode: string;
  apiUrl?: string;
  allowProductionApi: boolean;
};

type BuildEnvResult =
  | { ok: true; apiBaseUrl: string }
  | { ok: false; message: string };

const PROD_LIKE_MODES = new Set(["production", "staging", "preview"]);

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function validateApiUrlFormat(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return `${ENV_VAR_API_URL} cannot be empty.`;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return `${ENV_VAR_API_URL} must use http:// or https://`;
    }
  } catch {
    return `${ENV_VAR_API_URL} must be a valid URL`;
  }

  return null;
}

/**
 * Build-time API URL resolution (Node / Vite config only).
 * Dev server (`vite`) does not require VITE_API_URL — runtime falls back to localhost.
 */
export function resolveApiBaseUrlForBuild(input: BuildEnvInput): BuildEnvResult {
  const { mode, apiUrl, allowProductionApi } = input;
  const trimmed = apiUrl?.trim();

  if (!PROD_LIKE_MODES.has(mode)) {
    return { ok: true, apiBaseUrl: trimmed ? normalizeBaseUrl(trimmed) : "" };
  }

  if (!trimmed) {
    return { ok: false, message: buildMissingApiUrlMessage(mode) };
  }

  const formatError = validateApiUrlFormat(trimmed);
  if (formatError) {
    return { ok: false, message: formatError };
  }

  if (isKnownProductionApiHost(trimmed) && mode !== "production" && !allowProductionApi) {
    return {
      ok: false,
      message: `Refusing "${mode}" build with production API host (${trimmed}).`,
    };
  }

  return { ok: true, apiBaseUrl: normalizeBaseUrl(trimmed) };
}
