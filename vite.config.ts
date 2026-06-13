import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { isKnownProductionApiHost } from "./src/config/env.shared";
import { resolveApiBaseUrlForBuild } from "./vite.env";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const buildValidation = resolveApiBaseUrlForBuild({
    mode,
    apiUrl: env.VITE_API_URL,
    allowProductionApi: env.VITE_ALLOW_PRODUCTION_API === "true",
  });

  if (!buildValidation.ok) {
    throw new Error(buildValidation.message);
  }

  if (
    buildValidation.apiBaseUrl &&
    (mode === "staging" || mode === "preview") &&
    isKnownProductionApiHost(buildValidation.apiBaseUrl) &&
    env.VITE_ALLOW_PRODUCTION_API !== "true"
  ) {
    throw new Error(
      [
        `Refusing to build for "${mode}" with production API host.`,
        `Point VITE_API_URL at a staging backend or set VITE_ALLOW_PRODUCTION_API=true (not recommended).`,
      ].join(" ")
    );
  }

  return {
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
});
