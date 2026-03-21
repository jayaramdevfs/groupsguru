---
title: "Sprint 15 Closure"
date: "2026-03-22"
description: "Implementation of granular Pricing & Access Control"
---

# Sprint 15: Pricing & Access Control

## Objectives Achieved
1. **Granular Pricing Configuration:**
   - Modified `Category`, `SubCategory`, `Section`, `Topic`, and `MicroTopic` entities to include `priceInr` (Double) and `accessType` (String: `"FREE"` | `"PAID"`).
   - Updated mapping responses and builder classes for all respective node levels inside Backend services.
   - Built a recursive hierarchical `PricingController` for Admins.
   
2. **Access Control Service (`AccessService.java`)**
   - Created `checkAccess` endpoint at `GET /api/access/check/{entityType}/{entityId}`.
   - Implemented hierarchical bottom-up checking: verifies access type for a given node. If paid, it crawls up to `parent_id` pointers to offer the user recommended bundles logically.
   
3. **Admin Dashboard (Web)**
   - Created the standalone `app/admin/pricing/page.tsx` displaying the complete structural L0-to-L5 tree vertically.
   - Dynamic optimistic updating capabilities using the new backend `pricingApi.ts`.

4. **Mobile Client Enhancements**
   - Built reusable `PriceBadge` component injected into `StudentDashboard`, `CategoryScreen`, `SubCategoryScreen`, `SectionScreen`, `TopicScreen`, and `MicroTopicScreen`.
   - Built structural `PaywallModal.tsx`.
   - Attached modal gating to `TopicScreen` using the new `accessService` before allowing navigation into the deeper specific `MicroTopic` contents.

## Pending & Next Steps (Sprint 16)
Next step will be implementing **Payment Gateway Integration** (Sprint 16):
- Razorpay setup (Merchant IDs & webhook interceptors).
- Verify purchases upon successful Razorpay callbacks inside `AccessService`.
- Transition the `PaywallModal` string `alert()` to actual native Razorpay SDK calls.

---

**Sprint 15 is officially closed.**
