# Authentication Production Readiness Report

Repo: `impact-earn-market` (Vite + React SPA)  
Date: 2026-05-28  

> Scope: This repo contains **frontend auth** only. Backend source is not present here; backend items below are **required validations/contracts** inferred from frontend usage.

---

## 1) Current authentication design (as implemented)

### Token + user persistence (frontend)
- **Token** stored in: `localStorage["token"]` and `sessionStorage["token"]`
- **User** stored in: `localStorage["user"]` and `sessionStorage["user"]`
- **Auth transport**: `Authorization: Bearer <token>` header on protected requests

Files:
- `src/utils/auth.ts`
- `src/pages/login/Login.tsx`

### API base URL
- `VITE_API_URL` or fallback: `https://backend-23gy.onrender.com/api`

File:
- `src/utils/auth.ts`

### Frontend routes involved
Routes are defined in `src/App.tsx`:
- Public: `/login`, `/signup`, `/auth` → `src/pages/login/Login.tsx`
- Role select: `/select-role` → `src/pages/login/SelectRole.tsx`
- Protected: `/onboarding`, `/dashboard/*`, `/business/*`, `/influencer/*`, `/reseller/*`, `/admin/*` wrapped by `ProtectedRoute`

### Frontend auth gating (“middleware”)
`src/components/auth/ProtectedRoute.tsx`:
- If no stored user → redirect `/login`
- If no role → redirect `/select-role` (unless “admin bypass”)
- If not onboarded → redirect `/onboarding` (unless “admin bypass”)

---

## 2) Backend auth endpoints expected by frontend (contract)

### Manual auth
- `POST /auth/register` → expects `{ user, token }`
- `POST /auth/login` → expects `{ user, token }`

### OAuth start
- `GET /auth/google`
- `GET /auth/facebook`
- `GET /auth/linkedin`

### Profile/onboarding
- `GET /profile` (used by `fetchProfile()`) → expects `{ user, profile }`
- `PATCH /profile/role` → sets role (expects success JSON)
- `POST /profile` → saves profile & marks onboarded (expects success)

### Social linking used by settings pages
- `GET /auth/linked-accounts`
- Provider connects (frontend redirects): `/auth/youtube`, `/auth/instagram`, `/auth/facebook-link`, `/auth/linkedin`
- Provider disconnect: `DELETE /auth/{platform}/disconnect`
- Telegram verify: `POST /auth/telegram/verify`

---

## 3) Launch blockers (must fix before production)

### B1) Token leakage via URL (OAuth return)
**Where**
- `src/pages/login/Login.tsx` reads `?token=` and `?user=` from the URL and persists them.

**Risk**
- JWT can leak through browser history, referrer headers, server logs, analytics, screenshots.

**Required fix**
- Replace `token`-in-URL with one of:
  - **Cookie session** (httpOnly + Secure) (recommended)
  - **One-time code exchange** (backend redirects with `?code=...`, frontend exchanges to session)

**Ship criteria**
- No JWT appears in any URL in production.

### B2) Token leakage via URL (social connect)
**Where**
- Settings pages redirect to backend connect routes with `?token=${token}`.
  - `src/pages/dashboard/SettingsPage.tsx`
  - `src/pages/business/BusinessSettings.tsx`
  - `src/pages/influencer/InfluencerSettings.tsx`

**Risk**
- Token exposure to third-party redirects/logging; increases account takeover likelihood.

**Required fix**
- Initiate social connect using backend-managed session (cookie) or a short-lived **connect initiation nonce** (not a JWT).

**Ship criteria**
- Social connect URLs never include access tokens.

### B3) Admin logic mismatch (routing vs guard)
**Where**
- `src/pages/login/Login.tsx` uses `admin@trendzity.com` OR `role==='admin'`
- `src/components/auth/ProtectedRoute.tsx` uses `admintrendzity@gmail.com` for bypass

**Risk**
- Admins may get misrouted or blocked by onboarding/role gates depending on path.

**Required fix**
- Make admin determination **role-based only** (`user.role === 'admin'`), sourced from backend.
- Remove email-based bypass (or restrict to dev builds only).

**Ship criteria**
- Admin always reaches `/admin` and is never forced into role selection/onboarding.
- Non-admin cannot render `/admin/*` pages (see U2).

### B4) Environment safety (hardcoded backend default)
**Where**
- `src/utils/auth.ts` defaults to `https://backend-23gy.onrender.com/api` if `VITE_API_URL` is missing.

**Risk**
- Staging/local builds can accidentally hit production backend.

**Required fix**
- Make `VITE_API_URL` mandatory for staging/prod builds (fail fast).

**Ship criteria**
- Production build cannot run without explicit backend URL configuration.

---

## 4) High-risk issues (fix before launch if possible)

### H1) JWT stored in localStorage/sessionStorage
**Where**
- `src/utils/auth.ts`

**Risk**
- Any XSS can steal the JWT; localStorage is readable by JS.

**Recommended fix**
- Prefer cookie sessions (httpOnly) or short-lived access tokens with refresh rotation + strict CSP.

### H2) `/admin/*` routes not role-protected (frontend)
**Where**
- `src/App.tsx` places `/admin/*` under `ProtectedRoute` only, which doesn’t check admin role.

**Risk**
- Any logged-in onboarded user can navigate to `/admin` UI screens. Backend should still deny, but UI exposure is a security/UX risk.

**Fix**
- Add an `AdminRoute` guard that enforces `user.role === 'admin'`.

### H3) Missing centralized 401 handling
**Risk**
- Expired/invalid token yields broken pages instead of clean logout.

**Fix**
- Create a shared API wrapper that logs out + redirects to `/login` on 401/403.

---

## 5) Medium-risk issues (stability/quality)

### M1) `/select-role` is not router-guarded
**Where**
- Public route in `src/App.tsx`

**Risk**
- Inconsistent protection (page-level redirect instead of route-level).

**Fix**
- Add an `AuthOnlyRoute` (requires login but not role/onboarded), and wrap `/select-role`.

### M2) Signup “Full Name” not wired to request
**Where**
- `src/pages/login/Login.tsx` uses `name: email.split('@')[0]` for signup payload.

**Risk**
- Wrong user names in production; onboarding/profile inconsistencies.

**Fix**
- Send the actual name input.

---

## 6) Required backend validations (must exist server-side)

Even if frontend is perfect, backend must enforce:

### Identity & auth
- Validate JWT/cookie session for all protected endpoints.
- Enforce token expiry and signature verification.
- Rate-limit `/auth/login` and `/auth/register` (per IP + per account).
- Prevent user enumeration (generic errors).

### Authorization
- Admin endpoints must check admin role server-side (never trust frontend routing).
- Role updates (`PATCH /profile/role`) must reject invalid roles and prevent escalation to admin.
- Ownership checks on “my” endpoints (wallet/profile/withdrawals) must use token identity, not body params.

### OAuth/social linking security
- Validate OAuth `state` to prevent CSRF.
- Do not accept raw access tokens from query params; use cookie session or one-time exchange.
- Store provider tokens securely (encrypted at rest), and scope minimally.

---

## 7) Go-live checklist (auth-specific)

### Frontend
- [ ] Remove JWT-in-URL for OAuth callback; implement cookie session or code exchange
- [ ] Remove `?token=...` from all social connect redirects
- [ ] Replace localStorage JWT strategy (preferred) or add CSP + XSS hardening + short-lived tokens
- [ ] Unify admin logic (role-based) and add `AdminRoute`
- [ ] Add `AuthOnlyRoute` and wrap `/select-role`
- [ ] Centralize API client + 401/403 handling
- [ ] Require `VITE_API_URL` for prod builds

### Backend (must verify)
- [ ] Rate limiting + lockout/backoff on login/register
- [ ] Strong password hashing (argon2id/bcrypt)
- [ ] JWT/cookie session expiry + rotation strategy
- [ ] OAuth state/CSRF protections
- [ ] Admin authorization on every admin endpoint
- [ ] Audit logs for auth events (login/logout/role-change/link/disconnect)

---

## 8) Recommended target architecture (production-grade)

**Preferred**: backend-managed session via **httpOnly secure cookies**  
- Frontend uses `credentials: "include"` and no longer stores access tokens in JS-readable storage.

**If JWT must remain** (less ideal):
- Use short-lived access tokens + refresh rotation (refresh token in httpOnly cookie).
- Strict CSP, security headers, and centralized 401 handling.

