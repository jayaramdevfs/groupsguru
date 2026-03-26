# GroupsGuru Go-Live Checklist (PostgreSQL Edition)

This document contains final steps TO BE PERFORMED BY THE OWNER when flipping the switch for production go-live (groupsguru.in).

## Pre-Launch Phase (Infrastructure)

1. **Docker Setup**:
   - [ ] Ensure Docker Desktop (Windows) or Docker (Linux) is ALWAYS running.
   - [ ] Ensure `groupsguru-postgres` container is running (`docker-ps`).
   - [ ] Data persistence is on by default via Docker volume `groupsguru-postgres-data`.

2. **Secrets Configuration**:
   - [ ] Check `C:\GroupsGuru\Lms\.env.prod`.
   - [ ] [ ] Confirm `JWT_SECRET` is set to something secure and permanent.
   - [ ] [ ] Confirm `DATABASE_PASSWORD` matches the one in `docker-compose.yml`.
   - [ ] [ ] Confirm `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct.
     - *Note: Keep test keys until KYC is verified.*

3. **CORS & Domain Preparation**:
   - [ ] Currently `APP_CORS_ALLOWED_ORIGINS` is `http://localhost:3000`.
   - [ ] Before final Cloudflare launch, update `.env.prod` to `https://groupsguru.in`.
   - [ ] Set `APP_AUTH_COOKIE_SECURE=true` once running on HTTPS.
   - [ ] Set `APP_AUTH_COOKIE_SAME_SITE=Strict` or `Lax` as needed.

## Cloudflare Tunnel Configuration

1. **Connector**:
   - [ ] Run Cloudflare Tunnel to expose `localhost:3000` (frontend) and `localhost:8080/api` (backend) to `groupsguru.in`.
   - [ ] Ensure SSL is set to "Full" or "Full (Strict)" on Cloudflare dashboard.

## Final Verification (Launch Day)

1. [ ] **Backend Status**: Verify `http://localhost:8080/api/health` returns `UP`.
2. [ ] **First Admin Login**: Test `admin@lms.com` login on the production build.
3. [ ] **Data Check**: Verify all 866 MicroTopics are visible in the Admin Registry (875 rows total including 9 headers).
4. [ ] **Payment Test**: Perform a test transaction using Razorpay Test Mode.

## Maintenance

- [ ] Regularly backup `groupsguru-postgres-data` folder.
- [ ] Monitor CPU/Memory usage under load (PostgreSQL 15 recommendation: 2GB RAM minimum).

---
*Ready for Deployment*
