/**
 * Shared environment constants (safe for Vite config and browser bundles).
 */

/** Known production API hosts — blocked in dev/staging unless explicitly allowed. */
export const PRODUCTION_API_HOSTS = ["backend-23gy.onrender.com"] as const;

/** Default local API when `VITE_API_URL` is unset during `vite` dev server only. */
export const LOCAL_DEV_API_DEFAULT = "http://localhost:5000/api";

export const ENV_VAR_API_URL = "VITE_API_URL";
export const ENV_VAR_DEV_API_URL = "VITE_DEV_API_URL";
export const ENV_VAR_ALLOW_PRODUCTION_API = "VITE_ALLOW_PRODUCTION_API";

export function isKnownProductionApiHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return PRODUCTION_API_HOSTS.some(
      (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`)
    );
  } catch {
    return false;
  }
}

export function buildMissingApiUrlMessage(mode: string): string {
  return [
    `${ENV_VAR_API_URL} is required for "${mode}" builds.`,
    "Set it in Vercel (Production / Preview) or your CI pipeline before running vite build.",
    "Example: VITE_API_URL=https://staging-api.example.com/api",
  ].join(" ");
}
