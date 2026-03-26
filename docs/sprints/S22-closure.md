# Sprint 22 Closure — Content Management System (StudyMaterial)

### Vertical Slice Details

**Backend (Spring Boot)**
- Added new package `com.groupsguru.content` with:
  - `StudyMaterial` entity (bilingual metadata, hierarchy binding, file metadata, publish/order/delete flags, timestamps).
  - `StudyMaterialRepository` (entity-level lookup, published-only lookup, counts, paginated admin query).
  - `StudyMaterialService` (admin CRUD, soft delete, upload/download integration through `FileStorageService`).
  - `StudyMaterialRequest` DTO.
  - `AdminStudyMaterialController` (`/api/admin/content`) for paginated listing, create, update, delete, count, and entity-node filtering.
  - `StudentStudyMaterialController` (`/api/student/content`) for published browsing and protected download.
- Added student download access enforcement:
  - Resolves authenticated user by JWT principal email.
  - Calls `AccessService.checkAccess(userId, entityType, entityId)` before file download.
  - Returns `403` for unauthorized access.
- Updated `SecurityConfig` route rules:
  - `/api/admin/content/**` requires `ADMIN`.
  - `/api/student/content/**` requires `STUDENT`.
  - Added public GET matcher for `/api/content/**` for optional browse expansion.

**Frontend (Next.js)**
- Added `lib/content.ts` API client for admin and student content operations, including multipart upload and download URL helper.
- Extended `lib/types.ts` with:
  - `StudyMaterial`
  - `StudyMaterialRequest`
- Added `app/admin/content/page.tsx`:
  - Protected admin page.
  - Entity-type + entity-id filter bar.
  - Create/Edit modal with bilingual metadata fields, access settings, publish state, display order.
  - Drag-and-drop upload zone with file type restrictions (`.pdf`, `.txt`, `.png`, `.jpg`, `.jpeg`).
  - Data table with publish toggle, edit, delete actions.
- Added `app/student/content/page.tsx`:
  - Query-param-driven browse (`entityType`, `entityId`).
  - Published materials listing with bilingual labels, file type, file size.
  - Free content shows download CTA.
  - Paid content shows lock + price indicator.

### Verification Notes

- Backend compile check completed for the new content module and security configuration.
- Student download path now enforces hierarchy access via existing purchase/access stack.
- Frontend routes and API bindings created for end-to-end admin upload and student browse/download flow.
- Mobile scope intentionally N/A for this sprint.

### Git Metadata

- Commit message target: `Sprint 22 complete: Content Management System (StudyMaterial entity, file upload/download, admin CRUD, student browse)`

---

### NEXT SPRINT HANDOVER PROMPT

Copy and paste the following into the next conversation:

```text
I am starting Sprint 23: Question Bulk Upload.

Please check c:\GroupsGuru\Lms\SPRINTS.md and continue from the current resume point.

Sprint 22 (Content Management / StudyMaterial) is complete. Refer to:
- c:\GroupsGuru\Lms\docs\sprints\S22-closure.md

For Sprint 23, implement a robust admin bulk-upload pipeline for questions (file import + validation + error reporting + partial success strategy), and wire it into both backend and frontend admin workflows.
```
