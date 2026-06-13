import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getEnvConfigError } from "@/config/env";
import { EnvConfigError } from "@/components/EnvConfigError";

const envError = getEnvConfigError();
const root = document.getElementById("root")!;

if (envError) {
  createRoot(root).render(<EnvConfigError message={envError} />);
} else {
  createRoot(root).render(<App />);
}
