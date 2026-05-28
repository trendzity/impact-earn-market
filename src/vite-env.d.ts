/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Optional override for the localhost default used when VITE_API_URL is unset in dev. */
  readonly VITE_DEV_API_URL?: string;
  /** Set to "true" to allow known production API hosts during local/staging (escape hatch). */
  readonly VITE_ALLOW_PRODUCTION_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
