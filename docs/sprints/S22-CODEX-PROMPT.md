# Sprint S22: Content Management System — Codex Prompt

Copy everything below the line and paste into Codex/ChatGPT Go.

---

## CONTEXT

You are working on **GroupsGuru**, a custom LMS for APPSC/TSPSC/UPSC exam preparation. The project uses:

- **Backend:** Spring Boot 3.2.5, Java 17, H2 (dev), JPA/Hibernate, Lombok, JWT auth
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Mobile:** React Native 0.84 (skip mobile for this sprint)

**Project root:** `C:\GroupsGuru\Lms\`
- Backend: `groupsguru-backend/src/main/java/com/groupsguru/`
- Frontend: `groupsguru-frontend/`

**What exists:** Auth, 6-level hierarchy (Commission→Category→SubCategory→Section→Topic→MicroTopic), pricing + access control, Razorpay payments, intelligence engine, question bank, exam system, full frontend redesign.

**What you're building:** Sprint S22 — Content Management System (StudyMaterial entity, file upload/download, admin CRUD, student browse with access control).

---

## SPRINT S22 REQUIREMENTS

### Backend — New Package: `com.groupsguru.content`

**Create these files under `groupsguru-backend/src/main/java/com/groupsguru/content/`:**

#### 1. `StudyMaterial.java` (Entity)

```java
package com.groupsguru.content;

// Follow the EXACT pattern of Commission.java and Category.java entities

@Entity
@Table(name = "study_materials")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "title_te")
    private String titleTe;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_te", columnDefinition = "TEXT")
    private String descriptionTe;

    // Which hierarchy node this material belongs to
    @Column(name = "entity_type", nullable = false)
    private String entityType; // COMMISSION, CATEGORY, SUB_CATEGORY, SECTION, TOPIC, MICRO_TOPIC

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    // File info
    @Column(name = "file_name")
    private String fileName; // original filename

    @Column(name = "stored_file_name")
    private String storedFileName; // UUID-based stored name

    @Column(name = "file_type")
    private String fileType; // PDF, TEXT, IMAGE

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize; // bytes

    // Access control (same pattern as all hierarchy entities)
    @Column(name = "access_type", length = 10)
    @Builder.Default
    private String accessType = "FREE";

    @Column(name = "price_inr")
    private Double priceInr;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private boolean isPublished = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

#### 2. `StudyMaterialRepository.java`

```java
@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findByEntityTypeAndEntityIdAndIsDeletedFalseOrderByDisplayOrder(String entityType, Long entityId);
    List<StudyMaterial> findByEntityTypeAndEntityIdAndIsPublishedTrueAndIsDeletedFalseOrderByDisplayOrder(String entityType, Long entityId);
    long countByEntityTypeAndEntityIdAndIsDeletedFalse(String entityType, Long entityId);
    long countByIsDeletedFalse();
}
```

#### 3. `StudyMaterialService.java`

Methods needed:
- `getAll()` — paginated, all materials (admin)
- `getByEntity(entityType, entityId)` — all materials for a hierarchy node (admin, includes unpublished)
- `getPublishedByEntity(entityType, entityId)` — published only (student)
- `getById(id)` — single material
- `getCount()` — total count
- `create(request, file)` — upload file via existing `FileStorageService`, save metadata
- `update(id, request)` — update metadata only (title, description, etc.)
- `delete(id)` — soft delete + optionally delete file from disk
- `getFile(id)` — return file as Resource for download

**IMPORTANT:** Use the existing `FileStorageService` at `com.groupsguru.common.service.FileStorageService`. It already handles:
- `store(MultipartFile file)` → returns UUID-based filename
- `loadAsResource(String filename)` → returns Resource for download
- `delete(String filename)` → deletes file

Storage root is configured as `app.storage.location: ./uploads` in `application.yaml`.

#### 4. `dto/StudyMaterialRequest.java`

```java
@Data
public class StudyMaterialRequest {
    private String title;
    private String titleTe;
    private String description;
    private String descriptionTe;
    private String entityType;
    private Long entityId;
    private String fileType; // PDF, TEXT, IMAGE
    private String accessType;
    private Double priceInr;
    private Boolean isPublished;
    private Integer displayOrder;
}
```

#### 5. `AdminStudyMaterialController.java`

```
@RestController
@RequestMapping("/api/admin/content")
```

Endpoints:
- `GET /api/admin/content` — list all (paginated, admin only)
- `GET /api/admin/content/{id}` — get by id
- `GET /api/admin/content/entity/{entityType}/{entityId}` — list by hierarchy node
- `GET /api/admin/content/count` — total count
- `POST /api/admin/content` — create with multipart file upload
  - Accept: `@RequestPart("metadata") StudyMaterialRequest request, @RequestPart("file") MultipartFile file`
- `PUT /api/admin/content/{id}` — update metadata (JSON body, no file)
- `DELETE /api/admin/content/{id}` — soft delete

#### 6. `StudentStudyMaterialController.java`

```
@RestController
@RequestMapping("/api/student/content")
```

Endpoints:
- `GET /api/student/content/entity/{entityType}/{entityId}` — list published materials for a node
- `GET /api/student/content/{id}/download` — download file (CHECK ACCESS FIRST)

**Access check for download:** Use the existing `AccessService.checkAccess(userId, entityType, entityId)` to verify the student has access to the hierarchy node the material belongs to. If `hasAccess == false`, return 403.

To get the current userId from JWT, inject `@AuthenticationPrincipal` or use `SecurityContextHolder`:
```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String email = auth.getName();
// Then look up userId from UserRepository by email
```

#### 7. Update `SecurityConfig.java`

Add to the `.authorizeHttpRequests()` chain:
```java
.requestMatchers("/api/admin/content/**").hasRole("ADMIN")
.requestMatchers("/api/student/content/**").hasRole("STUDENT")
```

Add these BEFORE the existing `.requestMatchers("/api/admin/**").hasRole("ADMIN")` line.

Also add public browse endpoint (if you want unauthenticated users to see material listings without download):
```java
.requestMatchers(org.springframework.http.HttpMethod.GET, "/api/content/**").permitAll()
```

---

### Frontend — New Files

#### 1. `lib/content.ts` — API client

```typescript
import api from "./api";
import { StudyMaterial } from "./types";

export const contentApi = {
  // Admin
  getAll: async (page = 0, size = 20): Promise<{ content: StudyMaterial[]; totalElements: number; totalPages: number }> => {
    const response = await api.get(`/api/admin/content?page=${page}&size=${size}`);
    return response.data;
  },

  getByEntity: async (entityType: string, entityId: number): Promise<StudyMaterial[]> => {
    const response = await api.get(`/api/admin/content/entity/${entityType}/${entityId}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get("/api/admin/content/count");
    return response.data;
  },

  upload: async (metadata: Partial<StudyMaterial>, file: File): Promise<StudyMaterial> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    const response = await api.post("/api/admin/content", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: number, data: Partial<StudyMaterial>): Promise<StudyMaterial> => {
    const response = await api.put(`/api/admin/content/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/content/${id}`);
  },

  // Student
  getPublishedByEntity: async (entityType: string, entityId: number): Promise<StudyMaterial[]> => {
    const response = await api.get(`/api/student/content/entity/${entityType}/${entityId}`);
    return response.data;
  },

  downloadUrl: (id: number): string => `/api/student/content/${id}/download`,
};
```

#### 2. Add to `lib/types.ts`

```typescript
export interface StudyMaterial {
  id: number;
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  entityType: string;
  entityId: number;
  fileName?: string;
  storedFileName?: string;
  fileType?: string;
  mimeType?: string;
  fileSize?: number;
  accessType: string;
  priceInr?: number;
  isPublished?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyMaterialRequest {
  title: string;
  titleTe?: string;
  description?: string;
  descriptionTe?: string;
  entityType: string;
  entityId: number;
  fileType?: string;
  accessType?: string;
  priceInr?: number;
  isPublished?: boolean;
  displayOrder?: number;
}
```

#### 3. `app/admin/content/page.tsx` — Admin Content Management Page

Follow the EXACT same pattern as `app/admin/questions/page.tsx`:
- Use `<ProtectedLayout requiredRole="ADMIN">` wrapper
- Filter bar: entityType dropdown (COMMISSION, CATEGORY, SUB_CATEGORY, SECTION, TOPIC, MICRO_TOPIC) + entityId input
- File upload form with drag-and-drop zone (accept .pdf, .txt, .png, .jpg)
- Table showing: title, entityType, entityId, fileType, fileSize (human-readable), isPublished toggle, actions (edit/delete)
- Modal for create/edit with fields: title, titleTe, description, descriptionTe, entityType select, entityId, fileType, accessType (FREE/PAID), priceInr, file upload input
- Use the multipart upload via `contentApi.upload()`

#### 4. `app/student/content/page.tsx` — Student Content Browse Page

Follow pattern of student categories page:
- Takes `entityType` and `entityId` as query params: `/student/content?entityType=TOPIC&entityId=5`
- Fetches materials via `contentApi.getPublishedByEntity()`
- Shows cards with: title (bilingual via Multilang), fileType badge, fileSize
- Download button links to `contentApi.downloadUrl(id)`
- If material requires payment (accessType=PAID), show lock icon and price instead of download button

---

### DESIGN SYSTEM (MUST FOLLOW)

The frontend uses a dark theme — Claude Code Mirror aesthetic:
- Background base: `#191919`
- Background surface/cards: `#1E1E1E`
- Background elevated: `#2D2D2D`
- Border: `#3A3A3A` (1px solid)
- Accent: `#D97706` (amber-600)
- Text primary: `#E8E8E8`
- Text secondary: `#A0A0A0`
- Card radius: 8px (rounded-md)
- Font body: Plus Jakarta Sans
- **NO gradients, NO glow, NO glassmorphism, NO backdrop-blur**
- **NO hover animations** — border-color change only
- **ALL depth via 1px borders, NOT shadows**

---

### EXISTING PATTERNS TO FOLLOW

**Entity pattern:** See `Commission.java` — use `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`, `@PrePersist/@PreUpdate` for timestamps, soft delete via `isDeleted`.

**Controller pattern:** See `AdminQuestionController.java` — `@RestController`, `@RequestMapping`, `@Autowired` service, `ResponseEntity` returns.

**Service pattern:** See `QuestionService.java` — `@Service`, `@Autowired` repository, mapRequestToEntity helper, soft delete.

**Frontend API pattern:** See `lib/questions.ts` — axios-based, uses `api` instance from `lib/api.ts` (which proxies through Next.js rewrites to `localhost:8080`).

**Frontend page pattern:** See `app/admin/questions/page.tsx` — ProtectedLayout, filter bar, data table, modal CRUD, bilingual content.

---

### FILES TO CREATE

**Backend (7 files):**
1. `groupsguru-backend/src/main/java/com/groupsguru/content/StudyMaterial.java`
2. `groupsguru-backend/src/main/java/com/groupsguru/content/StudyMaterialRepository.java`
3. `groupsguru-backend/src/main/java/com/groupsguru/content/StudyMaterialService.java`
4. `groupsguru-backend/src/main/java/com/groupsguru/content/dto/StudyMaterialRequest.java`
5. `groupsguru-backend/src/main/java/com/groupsguru/content/AdminStudyMaterialController.java`
6. `groupsguru-backend/src/main/java/com/groupsguru/content/StudentStudyMaterialController.java`

**Frontend (3 files + 1 edit):**
7. `groupsguru-frontend/lib/content.ts`
8. `groupsguru-frontend/app/admin/content/page.tsx`
9. `groupsguru-frontend/app/student/content/page.tsx`

**Files to EDIT:**
10. `groupsguru-frontend/lib/types.ts` — add StudyMaterial + StudyMaterialRequest interfaces
11. `groupsguru-backend/src/main/java/com/groupsguru/config/SecurityConfig.java` — add content routes

---

### VERIFICATION

After implementation, verify:
1. `POST /api/admin/content` with a PDF file → material created, file stored in `./uploads/`
2. `GET /api/admin/content/entity/TOPIC/1` → returns materials for Topic 1
3. `GET /api/student/content/entity/TOPIC/1` → returns only published materials
4. `GET /api/student/content/{id}/download` → downloads the file (if student has access)
5. Admin page shows file list, can upload/edit/delete
6. Student page shows materials with download button

---

### IMPORTANT RULES

1. Do NOT modify any existing entity files (Question, Category, Commission, etc.)
2. Do NOT create new dependencies — Spring multipart is built-in, `FileStorageService` already exists
3. Use SOFT DELETE only (set `isDeleted = true`, never actually delete DB rows)
4. All text fields must support bilingual (En/Te pairs)
5. Reuse `AccessService.checkAccess()` for student access — do NOT write new access logic
6. Follow the existing code style exactly — Lombok annotations, naming conventions, package structure

### SPRINT CLOSURE

After completing all code, update `SPRINTS.md`:
- Add S22 row to the status table: `| 22 | Content Management (StudyMaterial) | ✅ Done | ✅ Done | ➖ N/A |`
- Update the resume point to: `Sprint 23 (Question Bulk Upload)`

Create closure doc at `docs/sprints/S22-closure.md` following the template in SPRINTS.md.

Commit with message: `Sprint 22 complete: Content Management System (StudyMaterial entity, file upload/download, admin CRUD, student browse)`
