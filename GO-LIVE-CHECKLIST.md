# GroupsGuru Go-Live Checklist

This document contains final steps TO BE PERFORMED BY THE OWNER when flipping the switch for production go-live (groupsguru.in).

---

## Phase 0: Security Audit Verification (Sprint 28)

> All items below were completed during the security audit. Verify they remain intact before launch.

- [x] Hardcoded secrets removed from `application.yaml` (JWT, Razorpay)
- [x] JWT startup validation added (`@PostConstruct` in JwtService — rejects null/short secrets)
- [x] Production cookie flags: `secure: true`, `same-site: Strict`
- [x] Public endpoints restricted to GET-only (POST/PUT/DELETE require auth)
- [x] Security headers in prod: HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- [x] Input validation on all DTOs (`@NotBlank`, `@NotNull`, `@Positive`, `@Size`)
- [x] `hibernate.ddl-auto: validate` in production (no auto-schema changes)
- [x] File upload MIME type whitelist + path traversal protection
- [x] Rate limiting extended to bulk upload + payment endpoints
- [x] Frontend 401 interceptor (auto-redirect to /login on token expiry)
- [x] `.gitignore` covers .env files, build artifacts, uploads

---

## Phase 1: Pre-Launch (Infrastructure)

1. **Environment Variables**:
   - [ ] Create `.env.prod` on the server (DO NOT commit to git).
   - [ ] Reference `groupsguru-backend/.env.example` for all required variables.
   - [ ] Set `JWT_SECRET` to a strong random string (minimum 32 characters).
   - [ ] Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test keys until KYC verified).
   - [ ] Set `SPRING_PROFILES_ACTIVE=prod`.

2. **Database**:
   - [ ] H2 file-based database persisted to `./data/groupsguru_db`.
   - [ ] No Docker or external DB services required.
   - [ ] Backup `./data/` directory before any deployment.

3. **CORS & Domain**:
   - [ ] Set `APP_CORS_ALLOWED_ORIGINS=https://groupsguru.in`.
   - [ ] `APP_AUTH_COOKIE_SECURE=true` (enforced by prod profile, but verify).
   - [ ] `APP_AUTH_COOKIE_SAME_SITE=Strict` (enforced by prod profile).

---

## Phase 2: Cloudflare Tunnel

1. **Connector**:
   - [ ] Run Cloudflare Tunnel to expose `localhost:3000` (frontend) and `localhost:8080/api` (backend) to `groupsguru.in`.
   - [ ] SSL set to "Full" or "Full (Strict)" on Cloudflare dashboard.

---

## Phase 3: Final Verification (Launch Day)

1. [ ] **Backend Health**: `curl https://groupsguru.in/api/health` returns `{"status":"UP"}`.
2. [ ] **Admin Login**: Login as `admin@lms.com` on production build.
3. [ ] **Student Login**: Login as `student@lms.com` on production build.
4. [ ] **Data Check**: Verify all 866 MicroTopics visible in Admin Registry.
5. [ ] **Payment Test**: Perform a Razorpay test transaction.
6. [ ] **Mobile App**: Verify mobile connects to production API.
7. [ ] **Cookie Security**: Confirm browser dev tools show HttpOnly + Secure cookie flags.

---

## Phase 4: Maintenance

- [ ] Regularly backup `./data/groupsguru_db*` files.
- [ ] Monitor CPU/Memory usage.
- [ ] Rotate `JWT_SECRET` periodically (invalidates all active sessions).
- [ ] Upgrade Razorpay to live keys after KYC verification.

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | Rama@1994 |
| Student | student@lms.com | Student@123 |

> **Change these passwords after first production login.**

---
*Last updated: 2026-03-31 (Sprint 28 — Security Audit)*
