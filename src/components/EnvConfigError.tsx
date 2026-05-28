import { ENV_VAR_API_URL } from "@/config/env.shared";

type EnvConfigErrorProps = {
  message: string;
};

export function EnvConfigError({ message }: EnvConfigErrorProps) {
  return (
    <div
      role="alert"
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "42rem",
        margin: "4rem auto",
        padding: "1.5rem",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
        Configuration error
      </h1>
      <p style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>{message}</p>
      <p style={{ fontSize: "0.875rem", color: "#555" }}>
        Local development: create <code>.env.local</code> with{" "}
        <code>
          {ENV_VAR_API_URL}=http://localhost:5000/api
        </code>
        . Production/staging: set <code>{ENV_VAR_API_URL}</code> in Vercel
        environment variables before deploying.
      </p>
    </div>
  );
}
