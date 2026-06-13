# Production Readiness Guide (Impact Earn Market / Trendzity Frontend)

This document is a **ship-to-production checklist** and **risk register** for the current repository (`impact-earn-market`). It is written to help you move the product live in a production-ready state.

> Scope note: this repository is a **Vite + React SPA**. It does **not** contain backend source code, so backend items are listed as **required contracts / recommended implementations** that must be verified in the backend repo/service.

---

## 1) Executive summary (what blocks launch)

### ✅ Launch blockers (must fix before production)

1. **JWT/token leakage via URL query params**
   - OAuth callback currently uses `?token=` + `?user=` on the frontend route.
   - Social-connect flows also append `?token=` to backend auth URLs.
   - This is a **critical security issue** (tokens can leak via browser history, referrers, logs, analytics).

2. **Inconsistent admin identity logic**
   - Admin bypass and routing checks do not agree on the admin email(s).
   - This can misroute admins or incorrectly apply onboarding/role gates.

3. **Environment safety**
   - The frontend falls back to a hardcoded backend URL when `VITE_API_URL` is not set.
   - This can cause staging/local builds to hit production backend unintentionally.

### ⚠️ Unstable flows (strongly recommended before launch)

- `/select-role` is not router-guarded (page-level redirect only).
- Signup “Full Name” input is not wired to the request payload (uses email prefix instead).
- No centralized handling for `401/403` (expired/invalid token leads to partial UI failures).
- Several dashboards contain mock/hardcoded datasets (misleading analytics and trust issues).

---

## 2) Current auth architecture (as implemented here)

### Frontend session model

- Token stored in `localStorage["token"]` and `sessionStorage["token"]`
- User stored in `localStorage["user"]` and `sessionStorage["user"]`
- Protected API calls send `Authorization: Bearer <token>`

Key files:
- `src/utils/auth.ts`
- `src/components/auth/ProtectedRoute.tsx`
- `src/pages/login/Login.tsx`
- `src/pages/login/SelectRole.tsx`
- `src/pages/login/Onboarding.tsx`

### Route guarding

- `ProtectedRoute` enforces:
  - user exists
  - role exists (unless admin bypass)
  - onboarded (unless admin bypass)

Routing is defined in `src/App.tsx`.

---

## 3) Security hardening (required)

### 3.1 Remove tokens from URLs (blocker)

#### Problem

The app currently:
- Accepts OAuth return values from `?token=` and `?user=` in `src/pages/login/Login.tsx`
- Redirects to backend “connect social” routes with `?token=${token}` in settings pages (e.g. YouTube/Instagram/Facebook/LinkedIn connect).

#### Why it’s dangerous

- URLs are stored in:
  - browser history
  - server access logs / CDN logs
  - analytics tools
  - referrer headers to third-party resources
  - screenshots / screen recordings

#### Production-ready designs (choose one)

**Option A (recommended): httpOnly cookie session**
- Backend sets an **httpOnly, secure cookie** on login/OAuth callback.
- Frontend stops storing JWT in localStorage.
- Frontend uses `credentials: "include"` for API calls.
- Add CSRF protection if required (same-site + CSRF token pattern).

**Option B: One-time code exchange (OAuth-safe for SPAs)**
- Backend redirects to frontend with `?code=<one-time>` (NOT a JWT).
- Frontend immediately calls backend `POST /auth/exchange` with the code.
- Backend returns session via cookie (preferred) or short-lived access token.

**Option C: PKCE-based OAuth for SPA**
- If you want true SPA OAuth without backend-managed sessions, implement OAuth PKCE end-to-end.

#### Frontend changes required (regardless of backend option)

- Stop parsing `token` directly from query string in `src/pages/login/Login.tsx`.
- Stop appending `?token=` to connect URLs in:
  - `src/pages/dashboard/SettingsPage.tsx`
  - `src/pages/business/BusinessSettings.tsx`
  - `src/pages/influencer/InfluencerSettings.tsx`
  - `src/pages/reseller/ResellerSettings.tsx` (if/when it adds connect)

**Acceptance criteria**
- No route in the app accepts or emits a JWT in the URL.
- All auth secrets are transported via **cookie** or **one-time exchange**, not query params.

---

## 4) Auth correctness & access control

### 4.1 Unify admin logic (blocker)

#### Problem
Admin determination differs between:
- `src/components/auth/ProtectedRoute.tsx` (admin bypass email)
- `src/pages/login/Login.tsx` (admin redirect conditions)

#### Production-ready approach

**Prefer roles, not emails**
- Backend should include `user.role` (e.g. `ADMIN`) in `GET /profile` and login responses.
- Frontend should treat admin as `user.role === 'admin'` (or canonical value).
- Eliminate email-based bypass or restrict it to dev only.

**Acceptance criteria**
- Admin user always lands in `/admin`.
- Admin user is never blocked by role-selection/onboarding gates.
- Non-admin users can never access `/admin` screens (frontend guard + backend authorization).

### 4.2 Add a proper guard for `/select-role` (recommended)

#### Problem
`/select-role` is currently outside route-level protection in `src/App.tsx`.
It has a page-level redirect to `/login`, but route-level is more robust and consistent.

#### Fix pattern

Create a lightweight guard (example name): `AuthOnlyRoute`
- Requires user/token present
- Does **not** require `role` or `onboarded`

Then wrap `/select-role` under that guard.

**Acceptance criteria**
- Unauthenticated visitors cannot access `/select-role`.
- New users can still access `/select-role` before onboarding completes.

---

## 5) API reliability & error handling

### 5.1 Centralize API calls + consistent 401 handling (recommended)

#### Current risk
Pages call `fetch()` directly. If token expires, each page fails differently:
- partial rendering
- silent console errors
- stuck loading spinners

#### Production-ready approach

Implement a single API helper (or wrapper around `fetch`) that:
- Injects auth (Bearer or cookie) consistently
- Handles `401/403` by:
  - clearing local session (if using localStorage)
  - redirecting to `/login` with a toast like “Session expired”
- Normalizes error responses

**Acceptance criteria**
- Any unauthorized API response reliably logs the user out and returns them to login.

### 5.2 Timeouts and aborts (recommended)

Add `AbortController` timeouts for long requests (especially AI endpoints, uploads, social linking).

---

## 6) Environment configuration (blocker)

### 6.1 Required environment variables

At minimum:
- `VITE_API_URL` — backend base URL (e.g. `https://api.yourdomain.com/api`)

**Do not rely on a production default** in production builds.

### 6.2 Recommended per-environment values

- Local: `VITE_API_URL=http://localhost:xxxx/api`
- Staging: `VITE_API_URL=https://staging-api.yourdomain.com/api`
- Production: `VITE_API_URL=https://api.yourdomain.com/api`

**Acceptance criteria**
- Build fails or shows a clear error banner if `VITE_API_URL` is missing in non-dev builds.

---

## 7) Remove mock/hardcoded “dashboard” data (recommended before launch)

Hardcoded analytics/financial data causes:
- user distrust
- wrong business decisions
- “fake metrics” perception

### Confirmed hardcoded datasets (examples)

- `src/pages/dashboard/DashboardHome.tsx`
  - `topUsers`, “Your Rank #45”, “+₹50 Bonus” label
- `src/pages/business/BusinessHome.tsx`
  - `performanceData` (charts)
- `src/pages/influencer/InfluencerHome.tsx`
  - `earningsData`, `engagementData`, `recentActivity`
- `src/pages/admin/AdminOverview.tsx`
  - `activityData`, `revenueData` are zeroed static arrays used for charts
- Entirely mock/static pages:
  - `src/pages/business/BusinessAnalytics.tsx`
  - `src/pages/influencer/InfluencerAnalytics.tsx`
  - `src/pages/influencer/InfluencerPortfolio.tsx`
  - `src/pages/admin/AdminReports.tsx`
  - `src/pages/admin/AdminFraud.tsx`
  - `src/pages/admin/AdminResellers.tsx`
  - `src/pages/reseller/ResellerWallet.tsx`
  - `src/pages/reseller/ResellerHome.tsx` (mostly static)

**Acceptance criteria**
- If real API is not ready, display explicit “Coming soon / sample data” labels behind a feature flag.
- Otherwise, replace with API-backed datasets.

---

## 8) Product UX stability (recommended)

### 8.1 Signup name bug (recommended)

Signup UI collects “Full Name” but the request payload uses email prefix.

- Fix by wiring the controlled `name` state into the payload.
- Ensure backend accepts `name`.

### 8.2 Redirect loop prevention

Make sure these are true:
- `ProtectedRoute` never forces onboarding for `/onboarding` itself (already handled)
- Users with stale local `user` but invalid token are forced to re-login (via centralized 401 handling)

---

## 9) Backend contract checklist (must verify in backend)

Even though backend code is not here, production requires confirming:

### Auth endpoints
- `POST /auth/register` returns `{ user, token }` or cookie session
- `POST /auth/login` returns `{ user, token }` or cookie session
- `GET /profile` returns `{ user, profile }` (or at least `user.role`, `user.onboarded`)
- `PATCH /profile/role` persists role
- `POST /profile` persists onboarding/profile and sets `onboarded=true`

### Authorization
- Every protected endpoint validates identity
- Admin endpoints enforce admin role server-side (frontend-only is insufficient)

### Token/session
- If using JWT: expiry, rotation/refresh strategy, revocation on logout
- If using cookies: secure, httpOnly, sameSite policy, CSRF story

---

## 10) Release checklist (copy/paste)

### Pre-release (code)
- [ ] Remove token-in-URL flows (OAuth + social-connect)
- [ ] Unify admin logic by role
- [ ] Add guard for `/select-role` (auth-only)
- [ ] Centralize API client + 401 handling
- [ ] Ensure `VITE_API_URL` is mandatory for staging/prod builds
- [ ] Replace or clearly label mock dashboard analytics
- [ ] Verify logout fully clears session and redirects reliably

### Pre-release (security)
- [ ] No secrets in frontend env other than public config
- [ ] Confirm backend CORS policy matches frontend origin(s)
- [ ] Confirm cookies (if used) have `Secure`, `HttpOnly`, `SameSite` (appropriate)
- [ ] Confirm rate limiting on auth endpoints

### Pre-release (ops)
- [ ] Set up uptime monitoring + error tracking (Sentry or equivalent)
- [ ] Confirm production build + deploy pipeline
- [ ] Confirm domain + HTTPS + HSTS

### Smoke tests (manual)
- [ ] Register → select role → onboarding → dashboard
- [ ] Login existing user → correct role dashboard
- [ ] Logout → cannot access protected routes
- [ ] Expired token → forced re-login with friendly message
- [ ] Admin login → can access `/admin`, non-admin cannot
- [ ] Social connect flows succeed without exposing tokens in URL

---

## 11) Suggested phased rollout plan

1. **Phase 0 (secure auth transport)**
   - Implement cookie session or one-time code exchange
   - Centralize API client + 401 handling

2. **Phase 1 (auth correctness)**
   - Unify admin logic
   - Add auth-only guard for `/select-role`
   - Fix signup name wiring

3. **Phase 2 (data truthfulness)**
   - Replace mock charts/analytics with real endpoints or label as sample

4. **Phase 3 (hardening)**
   - Monitoring, alerting, rate limiting, UX polish, accessibility, performance

---

## 12) Owner action items (short list)

- Decide session strategy: **cookie session (recommended)** vs JWT in storage.
- Provide backend support for:
  - OAuth return via cookie or one-time code exchange
  - social connect initiation without `?token=...`
- Provide authoritative `user.role` and `user.onboarded` from backend on `GET /profile`.

