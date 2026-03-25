# GroupsGuru — Master Sprint Plan (Vertical Slices)

**Updated**: 2026-03-25 (Sprint 21a closed)
**Architecture**: Vertical Slicing — each sprint delivers Backend + Frontend + Mobile together

---

## Mandatory Sprint Closure (MANDATORY)

Every sprint **MUST** conclude with the following steps BEFORE being marked as done:
1. **Doc Update**: Update `SPRINTS.md` status table.
2. **Post-Implementation Documentation**: Detail any architectural changes in sprint deliverables if they differ from initial plans.
3. **Git Commit & Push**: Commit all files with the message: `Sprint X complete: [Key feature]`.
4. **Final Verification**: Ensure the vertical slice (Backend + Frontend + Mobile) is functional.
5. **Next Sprint Handover**: At the very end of your final response, explicitly provide the user with a pre-written prompt for them to copy and paste into the NEW conversation for the next sprint. The prompt should explicitly reference `SPRINTS.md` and the master plan.

---

## Platform Stack

| Platform | Stack | Port |
|----------|-------|------|
| **Backend** | Spring Boot 3.2.5 · Java 17 · H2 (dev) / PostgreSQL (prod) · JWT | 8080 |
| **Frontend** | Next.js 16 · React 19 · Tailwind CSS 4 · Framer Motion | 3000 |
| **Mobile** | React Native 0.84 · React Navigation 7 · Axios | — |

---

## Project Directories

```
C:\GroupsGuru\Lms\
├── groupsguru-backend/    → Spring Boot API
├── groupsguru-frontend/   → Next.js web app
└── groupsguru-mobile/     → React Native mobile app
```

**Groups Guru Intelligence Source:** `C:\Users\jayar\OneDrive\Desktop\groupsguru`

---

## Current Status At A Glance

| Sprint | Feature | Backend | Frontend | Mobile |
|--------|---------|---------|----------|--------|
| 1 | Authentication | ✅ Done | ✅ Done | ✅ Done |
| 2 | Category (L0) | ✅ Done | ✅ Done | ✅ Done |
| 3 | SubCategory (L1) | ✅ Done | ✅ Done | ✅ Done |
| 4 | Section (L2) | ✅ Done | ✅ Done | ✅ Done |
| 5 | Topic (L3) | ✅ Done | ✅ Done | ✅ Done |
| 6 | MicroTopic (L4) | ✅ Done | ✅ Done | ✅ Done |
| 7 | Registry Data Migration | ✅ Done | ✅ Done | ✅ Done |
| 8 | Intelligence Engine | ✅ Done | ✅ Done | ✅ Done |
| 9 | Question Bank | ✅ Done | ✅ Done | ✅ Done |
| 10 | Exam Structure | ✅ Done | ✅ Done | ✅ Done |
| 11 | Student Exam Flow | ✅ Done | ✅ Done | ✅ Done |
| 12 | Results & Analytics | ✅ Done | ✅ Done | ✅ Done |
| 12a | UX Polish (Exam UI) | ✅ Done | ✅ Done | ✅ Done |
| 13 | Data Migration + PostgreSQL | ✅ Done | ✅ Done | ➖ N/A |
| 14 | Commission + Hierarchy Restructure | ✅ Done | ✅ Done | ✅ Done |
| 15 | Pricing + Access Control | ✅ Done | ✅ Done | ✅ Done |
| 15a | Post-Sprint Fix: H2 Migration + Cache Bug | ✅ Done | ✅ Done | ➖ N/A |
| 15b | Project Rename: LMS → GroupsGuru | ✅ Done | ✅ Done | ✅ Done |
| 16 | Razorpay Payment Integration | ✅ Done | ✅ Done | ✅ Done |
| 17 | Mobile Recovery & Native Payments | ✅ Done | ➖ N/A | ✅ Done |
| 17a | APPSC Content Hierarchy + Archive Cleanup | ✅ Done | ✅ Done | ➖ N/A |
| 18 | Admin Content Tree + Student Browse Drill-Down | ✅ Done | ✅ Done | ➖ N/A |
| 19 | MicroTopicLinker Fix + Publish/Order + Admin Questions CRUD | ✅ Done | ✅ Done | ➖ N/A |
| 20 | Intelligence Engine Upgrade (Gaps + Heatmaps) | ✅ Done | ✅ Done | ✅ Done |

| 20a | Frontend UI Reskin (claude.ai Theme) | ➖ N/A | ❌ Replaced by S21 | ➖ N/A |
| 21a | Frontend Redesign: Foundation + Auth | ➖ N/A | ✅ Done | ✅ Done |
| 21b | Frontend Redesign: Dashboards | ➖ N/A | ✅ Done | ✅ Done |
| 21c | Frontend Redesign: Content Browse | ➖ N/A | ⏳ Planned | ⏳ Planned |
| 21d | Frontend Redesign: Exam Flow | ➖ N/A | ⏳ Planned | ⏳ Planned |
| 21e | Frontend Redesign: Admin Pages | ➖ N/A | ⏳ Planned | ⏳ Planned |
| 21f | Frontend Redesign: Register + Polish | ➖ N/A | ⏳ Planned | ⏳ Planned |

**Resume Point:** Sprint 21c (Content Browse) — see `docs/sprints/S21-frontend-redesign-plan.md` for full plan.

### Execution Order:
```
Sprint 20 (Intelligence) -> Sprint 21a-f (Complete Frontend Redesign) -> Sprint 22 (Production Readiness)
```

---

## Data Model — Complete Hierarchy

```
Category (L0 — Exam)
  └── SubCategory (L1 — Subject)
        └── Section (L2 — Section)
              └── Topic (L3 — Topic)
                    └── MicroTopic (L4 — Atomic Micro-Topic)

--- Intelligence Layer (linked via microTopicId) ---

MicroTopic ←── PredictionScore      (1:1 prediction confidence)
MicroTopic ←── PyqAnalysis[]        (1:many PYQ question mappings)
MicroTopic ←── Question[]           (1:many bilingual MCQs)

--- Exam Layer ---

Exam ←── ExamQuestion[] ──→ Question  (many:many with ordering)
Exam ←── ExamAttempt[] ──→ User       (student attempts)
ExamAttempt ←── AttemptAnswer[]       (individual answers)
```

All entities: `createdAt`, `updatedAt`, `isDeleted` (soft-delete), bilingual (`name`/`nameTe` or `*En`/`*Te`).

---

## Design System (All Platforms Must Match) — UPDATED Sprint 21

> **Complete redesign in Sprint 21** — Claude Code Mirror aesthetic. Flat, restrained, border-based.

| Token | Value |
|-------|-------|
| Background (base) | `#191919` |
| Background (surface/cards) | `#1E1E1E` |
| Background (elevated) | `#2D2D2D` |
| Background (overlay/hover) | `#363636` |
| Background (inset/inputs) | `#141414` |
| Border (default) | `#3A3A3A` (1px solid) |
| Accent primary | `#D97706` (amber-600) |
| Accent hover | `#F59E0B` (amber-500) |
| Text primary | `#E8E8E8` |
| Text secondary | `#A0A0A0` |
| Text muted | `#666666` |
| Success | `#3D9A5F` |
| Error | `#C74444` |
| Warning | `#C4901A` |
| Info | `#4A8FBF` |
| Card radius | 8px (rounded-md) |
| Modal radius | 12px |
| Font display | Instrument Serif (400) |
| Font body | Plus Jakarta Sans (400, 500, 600, 700) |
| Font mono | JetBrains Mono (500) |
| Animation | **Almost none** — content renders instantly. Only modals/dropdowns animate (150ms). |
| Logo | Geometric "G" mark (concentric arcs) in amber |
| Wordmark | "Groups" (#E8E8E8) + "Guru" (#D97706) in Instrument Serif |
| Layout | Sidebar 260px + Top navbar 48px + Content centered max-width 900px |

**CRITICAL:**
- NO gradients, NO glow, NO orbs, NO glassmorphism, NO backdrop-blur
- NO hover animations (scale, translate-y, lift) — border-color change only
- NO stagger animations — cards render instantly
- ALL depth via 1px borders, NOT shadows
- See `docs/sprints/S21-frontend-redesign-plan.md` for full specification

---

## Bilingual System

All user-facing content supports English + Telugu.

| Platform | Implementation |
|----------|---------------|
| **Backend** | Every entity has `name`/`nameTe`, `description`/`descriptionTe`, or `*En`/`*Te` field pairs |
| **Frontend** | `<Multilang en="..." te="..." />` component + `LanguageContext` + `LanguageToggle` |
| **Mobile** | Bilingual fields from API; needs `LanguageContext` + toggle (build in Sprint 3 catch-up) |

---

## Auth System (All Platforms)

- JWT stored in **HttpOnly cookie** (set by backend)
- Roles: `ADMIN`, `STUDENT`
- Backend: Spring Security filter chain
- Frontend: `AuthContext` + `ProtectedLayout` wrapper
- Mobile: `AuthContext` + conditional navigation in `AppNavigator`
- All HTTP clients use `withCredentials: true`

---

## Test Credentials (Seeded by `DataInitializer.java`)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@lms.com` | `Admin@123` |
| **Student** | `student@lms.com` | `Student@123` |

> **CRITICAL:** These are the ONLY valid credentials. Do NOT use any other email/password combinations.

---

# SPRINT DETAILS

---

## Sprint 1 — Authentication ✅ DONE (All Platforms)

**Backend:** Register/Login/Logout endpoints, JWT generation, cookie handling, `User` entity, `SecurityConfig`
**Frontend:** Login page, Register page, `AuthContext`, `ProtectedLayout`
**Mobile:** `LoginScreen`, `AuthContext`, role-based `AppNavigator`

---

## Sprint 2 — Category Management (L0) ✅ DONE (Backend + Frontend + Mobile)

**Backend:** `Category` entity + Repository + Service + Controller. Public GET + Admin CRUD.
**Frontend:** Admin category management page + Student category browse page.
**Closure Date:** March 20, 2026
**Mobile:** Sprint 2 mobile blockers are resolved:
- AdminDashboard now has navigation cards to CategoryScreen.
- StudentDashboard navigates to CategoryScreen via Exam Categories.
- Category cards navigate onward (no dead-end behavior).
**Sprint 2 Closure Statement:** Category (L0) is fully functional across Backend, Frontend, and Mobile.

---

## Sprint 3 — SubCategory Management (L1) ✅ DONE (Backend + Frontend + Mobile)

**Backend:** ✅ Done — `SubCategory` entity + full CRUD
**Frontend:** ✅ Done — Admin subcategory management + Student browse
**Mobile:** ✅ Done

### Mobile Sprint 3 Deliverables:

**3a. `src/api/subCategoryService.ts`:**
```typescript
// Follow same pattern as categoryService.ts
getAll(): Promise<SubCategory[]>
getByCategoryId(categoryId: number): Promise<SubCategory[]>
```

**3b. Add to `src/api/types.ts`:**
```typescript
export interface SubCategory {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  syllabusCode: string;
  categoryId: number;
}
```

**3c. `src/screens/SubCategoryScreen.tsx`:**
- Receives `categoryId` and `categoryName` via navigation params
- Fetches subcategories via `subCategoryService.getByCategoryId(categoryId)`
- FlatList with subcategory cards (same card style as `CategoryScreen`)
- Shows bilingual name (pick based on language context)
- Pull-to-refresh, loading state, empty state
- Tap card → navigates to `SectionScreen` (Sprint 4)

**3d. `src/context/LanguageContext.tsx`:** (needed for bilingual support going forward)
- State: `language: "en" | "te"`
- Toggle function
- `useLanguage()` hook

**3e. `src/components/LanguageToggle.tsx`:**
- Button showing "EN" or "తెలుగు"
- Toggles language context
- Style: small pill button, `bg-purple-500/20`, positioned in headers

**3f. Update `AppNavigator.tsx`:**
- Add `SubCategoryScreen` to student stack
- `CategoryScreen` tap → navigates to `SubCategoryScreen` with `categoryId` param
- Wrap navigator in `LanguageProvider`

**3g. Update `App.tsx`:**
- Wrap with `LanguageProvider`

**Verification:** Login as student → see categories → tap one → see subcategories for that category. Language toggle switches names.

---

## Sprint 4 — Section Management (L2) ✅ DONE (Backend + Frontend + Mobile)

**Backend:** ✅ Done — `Section` entity + full CRUD
**Frontend:** ✅ Done — Admin section management + Student browse
**Mobile:** ✅ Done

### Frontend Sprint 4 — Finish:
- Complete `app/admin/sections/page.tsx` — CRUD table with modal forms
- `lib/sections.ts` — API client for sections endpoints
- Add Section types to `lib/types.ts`
- Add "Sections" nav card to admin dashboard
- Student: `app/student/sections/page.tsx` — browse sections by subcategory
- Follow existing admin page patterns (same as categories/subcategories pages)

### Mobile Sprint 4 Deliverables:

**4a. `src/api/sectionService.ts`:**
```typescript
getAll(): Promise<Section[]>
getBySubCategoryId(subCategoryId: number): Promise<Section[]>
```

**4b. Add `Section` type to `src/api/types.ts`:**
```typescript
export interface Section {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  sectionCode: string;
  subCategoryId: number;
}
```

**4c. `src/screens/SectionScreen.tsx`:**
- Receives `subCategoryId` and `subCategoryName` via navigation params
- Fetches sections via `sectionService.getBySubCategoryId(subCategoryId)`
- FlatList with section cards (same style)
- Tap card → navigates to `TopicScreen` (Sprint 5)

**4d. Update `AppNavigator.tsx`:** Add `SectionScreen` to stack.

**Verification:** Full student drill-down: Category → SubCategory → Section. All screens show bilingual names with toggle.

---

## Sprint 5 — Topic Layer (L3) ✅ DONE (Backend + Frontend + Mobile)

> First sprint where all 3 platforms are built together from scratch.

### Backend:
- `Topic` entity (package: `com.lms.topic`)
- Fields: `id`, `name`, `nameTe`, `description`, `descriptionTe`, `topicCode`, `sectionId` (FK → Section), `isDeleted`, `createdAt`, `updatedAt`
- `TopicRepository`, `TopicService`, `TopicController`
- DTOs: `CreateTopicRequest`, `UpdateTopicRequest`
- Public: `GET /api/topics`, `GET /api/topics/section/{sectionId}`
- Admin: `GET/POST/PATCH/DELETE /api/admin/topics`, `GET /api/admin/topics/count`
- Register in `SecurityConfig`

### Frontend:
- `app/admin/topics/page.tsx` — Admin CRUD page (same pattern as sections)
- `app/student/topics/page.tsx` — Student browse by section
- `lib/topics.ts` — API client
- Add Topic types to `lib/types.ts`
- Add "Topics" nav card to admin dashboard

### Mobile:
- `src/api/topicService.ts` — API client
- Add `Topic` type to `src/api/types.ts`
- `src/screens/TopicScreen.tsx` — FlatList with topic cards, navigated from SectionScreen
- Update `AppNavigator.tsx`

**Verification:** Full drill-down works on all 3 platforms: Category → SubCategory → Section → Topic.

---

## Sprint 6 — MicroTopic Entity & CRUD (L4) ✅ DONE (Backend + Frontend + Mobile)

> Creates the MicroTopic entity — the atomic unit that the Groups Guru intelligence system maps to. This sprint builds the entity and UI only; data loading happens in Sprint 7.

### Backend:
- `MicroTopic` entity (package: `com.lms.registry`)
- Fields:

| Field | Type | Notes |
|-------|------|-------|
| `id` | Long | Auto-generated |
| `microTopicId` | String (unique) | e.g., `MT-HIST-A1-001` |
| `subject` | String | History, Polity, Economy, Geography, Science |
| `sectionName` | String | e.g., "Paper-I (A1)" |
| `topicName` | String | e.g., "INDUS VALLEY CIVILIZATION" |
| `microTopicText` | String (length=2000) | Atomic micro-topic description |
| `syllabusRef` | String | Direct quote from official syllabus |
| `groupApplicability` | String | ALL_GROUPS, G3_PLUS, G2_PLUS, G1_ONLY |
| `depthLevel` | String | awareness, understanding, analytical |
| `contentType` | String | static, dynamic, static+dynamic |
| `topicCategory` | String | shared_gs, ap_specific |
| `pyqFrequency` | String (nullable) | |
| `difficultyTrend` | String (nullable) | |
| `predictionPriority` | String (nullable) | |
| `dataConfidence` | String | high, medium, low |
| `prelimsOrMains` | String | prelims, mains |
| `paper` | String | paper1, paper2, screening, etc. |
| `topicId` | Long (nullable FK) | Optional link to Topic entity (L3) |
| `isDeleted` | Boolean | default false |
| `createdAt` | LocalDateTime | |
| `updatedAt` | LocalDateTime | |

- `MicroTopicRepository`, `MicroTopicService`, `MicroTopicController`
- Public: `GET /api/registry/micro-topics` (paginated, filterable by `subject`, `paper`, `groupApplicability`), `GET /api/registry/micro-topics/{microTopicId}`
- Admin: full CRUD at `/api/admin/registry/micro-topics`

### Frontend:
- `app/admin/micro-topics/page.tsx` — Admin micro-topic management (table with filters: subject, paper, group)
- `lib/registry.ts` — API client
- Add `MicroTopic` interface to `lib/types.ts`
- Search bar for micro-topic text
- Subject/depth/confidence badges with purple accent colors
- Add "Micro-Topics" nav card to admin dashboard

### Mobile:
- `src/api/registryService.ts` — API client
- Add `MicroTopic` type to `src/api/types.ts`
- `src/screens/MicroTopicScreen.tsx` — navigated from TopicScreen, shows micro-topics for that topic
- Filter by subject, searchable
- Update `AppNavigator.tsx`

**Verification:** Full 5-level drill-down works: Category → SubCategory → Section → Topic → MicroTopic. Admin can CRUD micro-topics on web.
- **UI/UX Polish:** Ensured all admin pages use the `CustomSelect` component with the standard violet/indigo palette (removed all mismatched cyan colors).
- **Mobile Polish:** Custom high-res GroupsGuru app icon designed (`GG` violet->indigo), replacing default React Native Android icon across all res-buckets.

---

## Sprint 7 — Registry Data Migration ✅ DONE (Backend + Frontend + Mobile)

> Loads all 875 micro-topics from Groups Guru registry CSVs into the database. Frontend/mobile get data display enhancements.

### Backend:

**7a. Copy source data files into backend resources:**
Copy from `C:\Users\jayar\OneDrive\Desktop\groupsguru\` into `src/main/resources/groupsguru/`:
```
registry/              → all 9 CSV files (875 total rows)
intelligence/          → analysis/ (all CSVs), rulebook.md, terminology.csv
questions/             → the XML file(s)
```

**7b. `RegistryDataLoader` service (package: `com.lms.config`):**
- Implements `CommandLineRunner` (runs at startup)
- Reads all 9 registry CSVs from classpath `groupsguru/registry/`
- Parses each row → `MicroTopic` entity
- Inserts into DB (skip if `microTopicId` already exists)
- Logs count per file: `"Loaded 244 micro-topics from g1-prelims.csv"`
- **Throws exception on any parse error** (ZERO silent data loss)

**Source files and expected counts:**

| File | Rows |
|------|------|
| `g1-prelims.csv` | 244 |
| `g1-mains-paper2.csv` | 158 |
| `g1-mains-paper3.csv` | 90 |
| `g1-mains-paper4.csv` | 117 |
| `g1-mains-paper5.csv` | 68 |
| `g2-paper1.csv` | 73 |
| `g2-paper2.csv` | 63 |
| `g2-paper3.csv` | 30 |
| `g2-screening.csv` | 32 |
| **Total** | **875** |

**CSV column → entity field mapping:**
`micro_topic_id` → `microTopicId`, `subject` → `subject`, `section` → `sectionName`, `topic` → `topicName`, `micro_topic` → `microTopicText`, `syllabus_ref` → `syllabusRef`, `group_applicability` → `groupApplicability`, `depth_level` → `depthLevel`, `content_type` → `contentType`, `topic_category` → `topicCategory`, `pyq_frequency` → `pyqFrequency`, `difficulty_trend` → `difficultyTrend`, `prediction_priority` → `predictionPriority`, `data_confidence` → `dataConfidence`, `prelims_or_mains` → `prelimsOrMains`, `paper` → `paper`

### Frontend:
- Enhance `app/admin/micro-topics/page.tsx` — show loaded data count, add "Registry loaded: 875 micro-topics" status badge
- Add registry stats card to admin dashboard (total micro-topics, by subject breakdown)

### Mobile:
- Show micro-topic count on student dashboard
- MicroTopicScreen now shows real data (875 items with search/filter)

**Verification:** `SELECT COUNT(*) FROM micro_topic` = **875**. Spot-check 5 random rows against source CSVs.

---

## Sprint 8 — Intelligence Engine (PYQ Analysis + Prediction Engine) 📅 FULL VERTICAL SLICE ✅ Done

> Creates PYQ analysis and prediction score entities, loads historical data, implements the prediction formula, and builds the admin intelligence dashboard.

### Backend:

**8a. `PredictionScore` entity (package: `com.lms.intelligence`):**

| Field | Type |
|-------|------|
| `id` | Long (auto) |
| `microTopicId` | String (links to MicroTopic) |
| `subject` | String |
| `frequencyScore` | Double (0–1) |
| `depthScore` | Double (awareness=0.3, understanding=0.6, analytical=1.0) |
| `recurrenceScore` | Double (0–1) |
| `caLinkedBoost` | Double (+0.15 recent, +0.05 older) |
| `syllabusPriority` | Double (0–1) |
| `trendMomentum` | Double (-1 to +1) |
| `commissionBlendAppsc` | Double (0.3–1.0) |
| `commissionBlendUpsc` | Double (0.0–0.7) |
| `dataConfidence` | String (high/medium/low) |
| `predictionConfidence` | Double (**FINAL SCORE 0–1**) |
| `priorityRank` | String (VERY_HIGH/HIGH/MEDIUM/LOW) |
| `notes` | String (nullable) |
| `createdAt`, `updatedAt` | LocalDateTime |

**8b. `PyqAnalysis` entity (package: `com.lms.intelligence`):**

| Field | Type |
|-------|------|
| `id` | Long (auto) |
| `pyqId` | String (unique — e.g., `APPSC-G1-2016-P2-001a`) |
| `commission` | String (APPSC/UPSC/TSPSC) |
| `year` | Integer |
| `paper` | String |
| `questionNumber` | String |
| `subject` | String |
| `microTopicId` | String |
| `questionType` | String (ANALYTICAL/STATIC/STMT/ELIM/CA_STATIC/GK/SCHEME/MATCH/AR) |
| `cognitiveLevel` | String (L1/L2/L3/L4) |
| `difficulty` | String (easy/medium/hard/very_hard) |
| `recurrence` | String (first_time/repeat_topic/repeat_exact) |
| `caLinked` | Boolean |
| `questionSummary` | String (length=1000) |
| `createdAt`, `updatedAt` | LocalDateTime |

**8c. `PredictionEngineService`:**

Core formula:
```
predictionConfidence =
    0.30 * frequencyScore
  + 0.15 * depthScore
  + 0.25 * recurrenceScore
  + 0.15 * syllabusPriority
  + 0.15 * trendMomentum
```

Commission blending:
- AP-Specific (`topicCategory = "ap_specific"`): APPSC=1.0, UPSC=0.0
- Shared GS with 5+ APPSC questions: APPSC=0.6, UPSC=0.4
- Shared GS with 0–4 APPSC questions: APPSC=0.3, UPSC=0.7 (`dataConfidence=low`)

Priority thresholds: VERY_HIGH >= 0.70, HIGH 0.50–0.69, MEDIUM 0.30–0.49, LOW < 0.30

Methods: `recalculateAllScores()`, `getTopPredictions(subject, limit)`, `getPredictionsByPriority(rank)`

**8d. `IntelligenceDataLoader` (runs at startup after registry):**
- Load `groupsguru/intelligence/analysis/prediction-scores.csv` → 162 rows
- Load `groupsguru/intelligence/analysis/g1-pyq-analysis.csv` → 188 rows
- Load `groupsguru/intelligence/analysis/g2-pyq-analysis.csv` → 224 rows

**8e. Admin API:** `GET /api/admin/intelligence/predictions`, `/predictions/top`, `/predictions/by-priority/{rank}`, `POST /predictions/recalculate`, `GET /api/admin/intelligence/pyq-analysis`, `/pyq-analysis/stats`

### Frontend:
- `app/admin/intelligence/page.tsx` — Intelligence dashboard:
  - Stats cards: Total Micro-Topics, Avg Prediction Confidence, VERY_HIGH count, Total PYQs Analyzed
  - Prediction table (sortable by confidence DESC) with progress bars and priority badges
  - Filters: subject dropdown, priority rank dropdown
  - Click row → expand to show all score components
  - Priority badges: VERY_HIGH=emerald, HIGH=blue, MEDIUM=yellow, LOW=gray
- Add "Intelligence" nav card to admin dashboard

### Mobile:
- `src/screens/IntelligenceScreen.tsx` — simplified prediction view for admin role
- Shows top predictions by subject with priority badges
- FlatList with prediction cards

**Verification:** `SELECT COUNT(*) FROM prediction_score` = **162**, `SELECT COUNT(*) FROM pyq_analysis` = **410**. `recalculateAllScores()` output matches original CSV.

### Post-Sprint 8 Bug Fixes (2026-03-21):

**8f. Backend: `IntelligenceDataLoader` crash fix:**
- `g2-pyq-analysis.csv` contains `"archive"` in the `year` column for some rows (archive PYQs with no specific year)
- `Integer.parseInt("archive")` threw `NumberFormatException`, crashing the entire backend at startup
- **Fix:** Wrapped year parsing in try-catch; sets `year = null` for non-numeric values
- File: `IntelligenceDataLoader.java:120`

**8g. Frontend: Modal dropdown clipping fix:**
- `Modal.tsx` had `overflow-hidden` on the modal content wrapper
- This clipped the `CustomSelect` dropdown (z-index doesn't escape `overflow-hidden` parents)
- **Fix:** Removed `overflow-hidden` from modal wrapper, set body to `overflow-visible`

**8h. Frontend: Login placeholder overlap fix:**
- Browser autofill placed saved credentials over the placeholder text (both visible simultaneously)
- **Fix:** Replaced native `placeholder` with a floating label pattern in `AnimatedInput.tsx`
- Uses pure CSS `:not(:placeholder-shown)` and `:-webkit-autofill` sibling selectors to detect both typed and autofilled values
- Label floats above input text; no overlap regardless of autofill state

---

## Sprint 9 — Question Bank 📅 FULL VERTICAL SLICE

> Creates the Question entity, parses Moodle XML to extract 50 bilingual MCQs, and builds admin management UI.

### Backend:

**9a. `Question` entity (package: `com.lms.question`):**

| Field | Type |
|-------|------|
| `id` | Long (auto) |
| `questionCode` | String (unique — e.g., `GG-S11.1-Q01`) |
| `questionTextEn` | String (length=2000) |
| `questionTextTe` | String (length=2000) |
| `optionAEn`, `optionATe` | String |
| `optionBEn`, `optionBTe` | String |
| `optionCEn`, `optionCTe` | String |
| `optionDEn`, `optionDTe` | String |
| `correctOption` | String (A/B/C/D) |
| `explanationEn`, `explanationTe` | String (length=2000, nullable) |
| `microTopicId` | String (links to MicroTopic) |
| `subject` | String |
| `difficulty` | String (easy/medium/hard/very_hard) |
| `cognitiveLevel` | String (L1/L2/L3/L4) |
| `questionType` | String (STATIC/ANALYTICAL/STMT/ELIM/etc.) |
| `sprintId` | String (e.g., `S11.1`) |
| `penalty` | Double (default 0.25) |
| `isDeleted` | Boolean (default false) |
| `createdAt`, `updatedAt` | LocalDateTime |

**9b. `MoodleXmlParser` service (package: `com.lms.question`):**

Parses `groupsguru/questions/group-1/s11.1-history-ancient-medieval.xml` (50 MCQs).

Each `<question type="multichoice">` contains:
- `<name><text>` → questionCode
- `<questiontext>` → bilingual spans: `<span lang="en" class="multilang">` and `<span lang="te" class="multilang">`
- 4 `<answer>` elements — `fraction="100"` = correct, map position to A/B/C/D
- `<tags><tag><text>` → `key:value` metadata (micro_topic_id, subject, difficulty, cognitive_level, question_type, sprint)
- `<penalty>` → penalty value

**CRITICAL:** Log every parsed question. If ANY parse error → throw exception, do NOT skip silently.

**9c. `QuestionDataLoader`:** Runs at startup after registry loads. Logs: `"Loaded 50 questions from s11.1-history-ancient-medieval.xml"`

**9d. Admin CRUD:** `GET/POST/PUT/DELETE /api/admin/questions`, `GET /api/questions/count`

### Frontend:
- `app/admin/questions/page.tsx` — Question bank management
  - Table: code, subject, difficulty badge, type badge, sprint, micro-topic
  - Filters: subject, difficulty, type, sprint
  - Search by question text (EN + TE)
  - Click row → expand with full bilingual question + options + correct answer (green)
  - Difficulty badges: easy=emerald, medium=yellow, hard=orange, very_hard=red
- `lib/questions.ts` — API client
- Add "Question Bank" nav card to admin dashboard

### Mobile:
- Admin: `src/screens/QuestionListScreen.tsx` — searchable question list
- Student: no direct access to question bank (questions served via exams)

**Verification:** `SELECT COUNT(*) FROM question` = **50**. Spot-check 5 questions: EN text, TE text, correct answer, all options, tags match source XML.

---

## Sprint 10 — Exam Structure ✅ DONE (Full Vertical Slice)

> Creates Exam and ExamQuestion entities, admin CRUD, and student exam browser.

### Backend:

**10a. `Exam` entity (package: `com.lms.exam`):**

| Field | Type |
|-------|------|
| `id` | Long (auto) |
| `name`, `nameTe` | String |
| `description`, `descriptionTe` | String |
| `examType` | String (TOPIC_WISE/SECTION_WISE/SUBJECT_WISE/FULL_LENGTH_TEST) |
| `subject` | String (nullable — null for FLT) |
| `totalQuestions` | Integer |
| `durationMinutes` | Integer |
| `negativeMarking` | Boolean (default true) |
| `penaltyPerWrong` | Double (default 0.25) |
| `marksPerQuestion` | Double (default 1.0) |
| `isActive` | Boolean (default true) |
| `isDeleted` | Boolean (default false) |
| `createdAt`, `updatedAt` | LocalDateTime |

**10b. `ExamQuestion` join entity:**
`id`, `examId` (FK), `questionId` (FK), `questionOrder` (Integer)

**10c. Seed 2 sample exams:**
1. "History — Ancient & Medieval India" (TOPIC_WISE, 25Q, 30min)
2. "History — Full Sprint S11.1" (SECTION_WISE, 50Q, 60min)

**10d. API:** Public: `GET /api/exams`, `GET /api/exams/{id}`. Admin: full CRUD + `POST /api/admin/exams/{id}/assign-questions`

### Frontend:
- `app/student/exams/page.tsx` — Exam browser (filter tabs by type, exam cards with name/type/questions/duration)
- `app/student/exams/[id]/page.tsx` — Exam detail (info cards, rules, "Start Exam" button with modal)
- `lib/exams.ts` — API client
- Add Exam types to `lib/types.ts`
- Update student dashboard with "Available Exams" nav card + stats
- Admin: `app/admin/exams/page.tsx` — Exam CRUD + question assignment

### Mobile:
- `src/screens/ExamListScreen.tsx` — Browse available exams (FlatList with exam cards)
- `src/screens/ExamDetailScreen.tsx` — Exam info + "Start Exam" button
- `src/api/examService.ts` — API client
- Add `Exam` type to `src/api/types.ts`
- Update student dashboard with exam navigation

**Closure Date:** March 21, 2026
**Verification:** 2 sample exams visible on all 3 platforms. Admin can create exams and assign questions. All screens strictly follow the established design system (violet/indigo palette). Bilingual support works across all platforms.

---

## Sprint 11 — Student Exam Flow ✅ DONE

> Implements the exam-taking experience: start → answer → submit → score.

### Backend:

**11a. `ExamAttempt` entity:**
`id`, `examId` (FK), `userId` (FK), `startedAt`, `submittedAt` (nullable), `totalMarks` (nullable), `correctCount`, `wrongCount`, `unattemptedCount`, `status` (IN_PROGRESS/SUBMITTED/EVALUATED), `createdAt`

**11b. `AttemptAnswer` entity:**
`id`, `attemptId` (FK), `questionId` (FK), `selectedOption` (nullable — A/B/C/D/null), `isCorrect` (nullable)

**11c. Scoring logic:**
```
correct answer   → +marksPerQuestion
wrong answer     → -penaltyPerWrong
skipped          → 0
totalMarks       → sum (floor at 0)
```

**11d. Student API:**
- `POST /api/exams/{id}/start` → creates attempt, returns attemptId + questions (WITHOUT correctOption)
- `POST /api/exams/attempts/{attemptId}/submit` → accepts answers, scores, returns result
- `GET /api/exams/attempts/{attemptId}/result` → full breakdown
- `GET /api/exams/my-attempts` → student's history

### Frontend:
- `app/student/exams/[id]/attempt/page.tsx` — Quiz-taking UI:
  - Timer (countdown, red warning < 5 min, auto-submit at 0)
  - Question display (bilingual via Multilang)
  - 4 option cards (selectable, purple highlight on selected)
  - Question nav panel (numbered circles: unanswered/answered/marked/current)
  - Previous/Next/Mark for Review buttons
  - Submit button with confirmation modal
  - Language toggle in top bar
- `components/exam/ExamTimer.tsx`
- `components/exam/QuestionDisplay.tsx`
- `components/exam/QuestionNavPanel.tsx`

### Mobile:
- `src/screens/ExamAttemptScreen.tsx` — Quiz-taking (timer, question display, option selection, navigation, submit)
- `src/components/ExamTimer.tsx`
- `src/components/QuestionCard.tsx`
- `src/components/OptionButton.tsx`
- Bottom sheet or scrollable strip for question navigation

**Closure Date:** March 21, 2026
**Verification:** Student can start an exam, see a timer, navigate questions, and submit. Auto-submission on time expiry verified.

### Post-Sprint 11 Bug Fixes (2026-03-21):

**11e. Backend: `ExamQuestionRepository` missing method:**
- `ExamAttemptService` called `findByExamIdOrderByQuestionOrder()` but the repository only had `findByExamId()`
- **Fix:** Added `findByExamIdOrderByQuestionOrder(Long examId)` to `ExamQuestionRepository`

**11f. Backend: JWT Bearer token support (mobile login fix):**
- React Native cannot use HttpOnly cookies — `Set-Cookie` headers are silently ignored
- `JwtAuthenticationFilter` only read tokens from cookies, so mobile was always unauthenticated
- **Fix (Backend):** Filter now checks `Authorization: Bearer <token>` header as fallback after cookies
- **Fix (Backend):** Login endpoint now returns JWT token in response body (`data` field)
- **Fix (Mobile):** `api.ts` stores token in memory, attaches via axios interceptor
- **Fix (Mobile):** `AuthContext.tsx` persists token to AsyncStorage for session restore

**11g. Backend: SecurityConfig — exam start endpoint access:**
- `POST /api/exams/{id}/start` was blocked for authenticated students (only GET was `permitAll`)
- **Fix:** Added `/api/exams/*/start` to permitted paths for authenticated users

**11h. Diagnostic error messages (replacing "Invalid credentials or server error"):**
- Mobile showed the same generic error for ALL failures: network, auth, server, token
- **Fix (Mobile):** `AuthContext.tsx` now throws specific errors for each failure mode:
  - `ERR_NETWORK` → "Cannot reach server" + adb reverse instructions
  - HTTP 401/403 → "Invalid email or password"
  - No token in response → "Backend may need to be updated"
  - `/me` fails after login → "JWT Bearer token not working"
- **Fix (Mobile):** `LoginScreen.tsx` now displays `error.message` instead of hardcoded string
- **Fix (Backend):** `GlobalExceptionHandler.java` returns proper HTTP status codes:
  - "Invalid credentials" → 401, "not found" → 404, "already" → 409, "unauthorized" → 403

---

## Known Issue: "Invalid Credentials" — Root Cause Analysis

This error has **3 distinct causes** that previously all showed the same message:

### Cause 1: Mobile cannot use HttpOnly cookies (FIXED)
- **Why:** React Native doesn't have a browser cookie jar. `Set-Cookie` headers are silently ignored.
- **Symptom:** Login POST returns 200 (success), but the follow-up `GET /api/auth/me` fails because no cookie is sent → app catches exception → shows "Invalid credentials"
- **Fix:** Backend returns JWT in response body. Mobile stores in AsyncStorage. Axios interceptor sends `Authorization: Bearer <token>` header. Backend `JwtAuthenticationFilter` reads Bearer header as fallback.
- **How to verify:** `curl -X POST localhost:8080/api/auth/login ...` → response body has `"data": "<jwt>"` (not `null`)

### Cause 2: H2 in-memory database resets on restart
- **Why:** `ddl-auto: create-drop` + `jdbc:h2:mem:lms_db` means every backend restart wipes all data. `DataInitializer` re-seeds admin/student users, but if it fails silently, users won't exist.
- **Symptom:** Credentials are correct but user doesn't exist in DB → 401
- **How to verify:** Check backend startup logs for `"Default ADMIN user created"` and `"Default STUDENT user created for Jayram."`
- **Will be resolved in Sprint 13:** PostgreSQL migration with persistent storage

### Cause 3: ADB reverse not active (mobile only)
- **Why:** Physical Android device can't reach `localhost:8080` without USB port forwarding
- **Symptom:** `ERR_NETWORK` — request never reaches backend
- **Fix:** Run `adb reverse tcp:8080 tcp:8080` before launching the mobile app
- **How to verify:** From device, the login request should appear in backend logs

### Developer Checklist (before debugging login):
1. Is backend running? → `curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"admin@lms.com","password":"Admin@123"}'`
2. Did DataInitializer run? → Check logs for "Default ADMIN user created"
3. For mobile: is ADB bridge active? → `adb reverse tcp:8080 tcp:8080`
4. Is token in login response body? → Response should have `"data": "eyJ..."`
5. Does Bearer auth work? → `curl localhost:8080/api/auth/me -H "Authorization: Bearer <token>"`

---

## Sprint 12 — Results & Analytics 📅 FULL VERTICAL SLICE

> Shows detailed exam results with question-by-question breakdown and topic-wise analysis.

### Backend:
- Enhance result endpoint to include question details, explanations, and topic-wise grouping
- `GET /api/exams/attempts/{attemptId}/result` returns: score summary + per-question breakdown + topic-wise stats

### Frontend:
- `app/student/exams/[id]/results/page.tsx`:
  - Circular progress indicator (SVG, gradient stroke)
  - Score: `{totalMarks}/{maxMarks}` in gradient text
  - Stats row: Correct (green), Wrong (red), Skipped (gray)
  - Topic-wise breakdown table (hit rate per topic)
  - Question-by-question cards: question text, your answer vs correct, color-coded (green/red/gray), explanation
- `components/exam/ResultBreakdown.tsx`

### Mobile:
- `src/screens/ExamResultScreen.tsx`:
  - Score summary with circular progress
  - Correct/Wrong/Skipped counts
  - Scrollable question review list
  - Color-coded answer cards
- `src/components/CircularProgress.tsx`

**Closure Date:** March 21, 2026
**Verification:** Results display correctly on all platforms. Scores match. Topic breakdown is accurate. Per-question review shows explanations and highlights correct/incorrect selections.

---

## Sprint 12a — UX Polish (Exam UI) 📅

> **Context:** Post-Sprint 11 verification revealed UX problems on both web and mobile
> exam screens. Content is too large, wastes space, and bilingual rendering is incomplete.

### UX Issues Identified (2026-03-21):

**Issue 1: Text size too large on exam screens (Web + Mobile)**
- Question text, option text, and labels are oversized
- On mobile (portrait), a single match-the-following question fills the entire screen

---

## Sprint 13 — Data Migration + PostgreSQL ✅ DONE (Backend + Frontend + Mobile)

> **Context:** This sprint established the foundational Database system and local file storage, laying the groundwork for the hierarchical restructure in Sprint 14.

### Backend:
- Replaced the H2 in-memory DB with PostgreSQL `lms-postgres` running via `docker-compose.yml`.
- Refactored `application.yaml` to connect to PostgreSQL with `ddl-auto: update`.
- Handled the idempotency of data by filtering duplicates using `QuestionCode` and ensuring `DataLoaders` do not insert duplicated elements over API restarts.
- Engineered a robust local file system `FileStorageService` mapped to project root `uploads/` for managing and serving generic files (PDFs/metadata) consistently.
- Created `GET /api/admin/migration/status` endpoint to pull `microTopic` and `question` populated lengths for sanity checks.

### Frontend:
- Generated a dashboard view `app/admin/migration/page.tsx` that visually monitors the exact DB states mimicking the app branding (displaying Micro-Topics tracked against the 1,021 goal natively).

### Mobile:
- N/A - No modifications intended. 

**Closure Date:** March 22, 2026
**Verification:** Docker containers spin up beautifully, data models generated and correctly constrained, API serves expected registry mapping dynamically directly linking the Database to the active Frontend Dashboard.

- On web, the question card takes most of the viewport with few options visible
- **Fix needed:** Reduce font sizes for question body, option labels, and exam header
- **Target:** At least 1 full question + all 4 options visible without scrolling (both platforms)

**Issue 2: Questions not rendered in Telugu (bilingual gap)**
- Questions display only in English (`questionTextEn`) even when Telugu mode is selected
- Answer options correctly show both English and Telugu (`optionAEn` / `optionATe`)
- **Root cause:** Exam attempt screen likely only reads `questionText` (English field) and doesn't switch to `questionTextTe` based on language context
- **Fix needed:** Wire up language toggle to display `questionTextTe` when Telugu is selected

**Issue 3: Exam screen space efficiency (Mobile)**
- Prev / Submit / Next buttons are very large, consuming valuable screen real estate
- Question navigator (if present) should be collapsible on mobile
- **Fix needed:** Compact button bar, smaller padding, better use of vertical space

### Tasks:
- [x] Frontend: Reduce exam question/option font sizes and padding
- [x] Frontend: Wire Telugu question text to language toggle
- [x] Mobile: Reduce exam question/option font sizes and padding
- [x] Mobile: Wire Telugu question text to language toggle
- [x] Mobile: Compact navigation buttons (Prev/Submit/Next)
- [x] Both: Ensure 1 question + 4 options visible without scrolling
- [x] Mobile: Professional logo layout matching web
- [x] Mobile: Address UI clipping and flashlight glow effects

---

## Sprint 15a — Post-Sprint Hotfix: H2 Migration + Cache Bug ✅ DONE

> **Context:** After Sprints 13–15 were executed by Gemini 3.14 without intermediate testing, the student login was found stuck in an infinite redirect/loading loop while admin login worked fine.

### Root Cause Analysis

**Symptom:** Student login appeared to redirect infinitely — the page showed a permanent loading spinner and any navigation was interrupted.

**Actual Bug:** The Next.js dev server (Turbopack) had a **corrupted build cache** causing an infinite Fast Refresh rebuild loop every 2–4 seconds. Each rebuild reset React state, so `AuthContext.loading` never resolved to `false`. The `ProtectedLayout` component was stuck showing its loading state, and role-based redirects were constantly interrupted by the next rebuild cycle.

**Why it appeared student-only:** Admin was tested first (generating fresh cache), then student was tested with the now-corrupted cache. The bug was environment-related, not role-related.

**Fix:**
1. Deleted `.next/` cache directory and `tsconfig.tsbuildinfo`
2. Restarted dev server with a clean build
3. Both admin and student login worked immediately

### Database Migration: PostgreSQL → H2 (Development)

Switched development environment from Docker/PostgreSQL to H2 file-based database to reduce resource overhead. PostgreSQL configuration preserved for production deployment.

**Changes Made:**
- **`application.yaml`** — Restructured to use Spring profiles. Default profile set to `dev`. Common config only (JWT, CORS, storage, server port).
- **`application-dev.yaml`** (new) — H2 file-based database (`jdbc:h2:file:./data/groupsguru_db`) with H2 console enabled at `/h2-console`.
- **`application-prod.yaml`** (new) — PostgreSQL config with environment variable support (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`).
- **`SecurityConfig.java`** — Added `/h2-console/**` permitAll and frame options `sameOrigin` for H2 console access.
- **`.gitignore`** — Added `data/` to exclude H2 database files.

**Switching profiles:**
- Dev (default): `./mvnw spring-boot:run` — uses H2, no Docker needed
- Prod: `SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run` — uses PostgreSQL

**Closure Date:** March 22, 2026
**Verification:** Admin and student login both functional. H2 database seeded correctly via DataInitializer. All existing APIs operational.

---

## Sprint 15b — Project Rename: LMS → GroupsGuru ✅ DONE

> **Context:** Rebranded the entire project from generic "LMS" naming to "GroupsGuru" to match the domain (groupsguru.in) and product identity.

### Changes Made (130+ files, 220+ references)

**Java Backend (107 files):**
- Renamed package `com.lms` → `com.groupsguru` across all 107 source files
- Renamed `LmsApplication.java` → `GroupsGuruApplication.java`
- Renamed test class `LmsApplicationTests` → `GroupsGuruApplicationTests`

**Configuration Files:**
- **`pom.xml`** — groupId: `com.groupsguru`, artifactId: `groupsguru`, name: `groupsguru`
- **`application.yaml`** — app name: `groupsguru`
- **`application-dev.yaml`** — database: `groupsguru_db`
- **`application-prod.yaml`** — database: `groupsguru_db`
- **`docker-compose.yml`** — container: `groupsguru-postgres`, db: `groupsguru_db`

**Frontend:**
- **`package.json`** — name: `groupsguru-frontend`

**Mobile (Android + iOS):**
- Package: `com.lmsmobile` → `com.groupsguru`
- App name/module: `lmsMobile` → `groupsguru-mobile`
- Updated: `build.gradle`, `settings.gradle`, `app.json`, `package.json`
- Updated: `Podfile`, `Info.plist`, `AppDelegate.swift`, Xcode project/scheme files

**Folder Renames:**
- `lms-backend/` → `groupsguru-backend/`
- `lms-frontend/` → `groupsguru-frontend/`
- `lmsMobile/` → `groupsguru-mobile/`

**Document Archival:**
- Consolidated all scattered planning docs from `Documents& plans&rules/`, `docs/`, `Repo/`, `postam/` into single `C:\GroupsGuru\archive/` folder
- Single master document: `SPRINTS.md`

**Closure Date:** March 22, 2026
**Domain:** groupsguru.in

---

## Sprint 17 — Mobile Recovery & Native Payments ✅ DONE

> **Context:** After Sprint 15b rename, the mobile `src/` directory was lost during folder copy (file lock issues on Windows). Sprint 16 completed Razorpay for backend + web but mobile was blocked. This sprint recovers all mobile source and integrates native Razorpay payments.

### Recovery
- Recovered 43 missing source files from git history (`ec3c394`)
- Files restored: `App.tsx`, all `src/` (api, components, context, navigation, screens), Android Kotlin files, `package.json`, `app.json`
- Applied GroupsGuru rename to all recovered files

### Razorpay Mobile Integration
- **`src/api/paymentService.ts`** (new) — `createOrder()` and `verifyPayment()` API calls matching web `lib/payment.ts`
- **`src/components/PaywallModal.tsx`** (rewritten) — Full Razorpay checkout flow using `react-native-razorpay` SDK
  - Primary purchase option (direct entity)
  - Bundle upsell options (parent entities)
  - Loading states, error handling, cancellation support
  - Purple/indigo theme matching web design
- **`src/screens/TopicScreen.tsx`** (updated) — Passes `entityType`, `entityId`, `entityName`, `onSuccess` to PaywallModal. On payment success, navigates to MicroTopic screen.
- **`package.json`** — Added `react-native-razorpay@^2.3.0`

### Payment Flow (Mobile)
```
TopicScreen → accessService.checkAccess("TOPIC", id) →
  hasAccess? → navigate to MicroTopic
  !hasAccess? → PaywallModal opens →
    User taps option → paymentService.createOrder() →
    RazorpayCheckout.open() → native payment UI →
    Success → paymentService.verifyPayment() → navigate
```

**Closure Date:** March 22, 2026
**Parity:** Mobile now matches web PaywallModal + PriceBadge functionality.

---

## Sprint 17a — APPSC Content Hierarchy + Archive Cleanup ✅ DONE

> **Context:** The DataSeeder was seeding 6 generic categories (UPSC, SSC, Banking, APPSC G1-4) with no children — empty shells with no subjects, sections, or topics. Students clicking any category saw nothing. Additionally, scattered planning documents across 5+ folders needed consolidation.

### DataSeeder Rewrite
- **`DataSeeder.java`** — Complete rewrite from flat category list to full APPSC hierarchy
- Removed generic categories (UPSC, SSC, Banking) — APPSC-only focus
- Seeds **4 categories**: APPSC Group 1, 2, 3, 4 (linked to APPSC commission)
- Seeds **6 subjects** under Group 1: History & Culture, Geography, Polity & Governance, Economy, Science & Technology, Current Affairs & Aptitude
- Seeds **14 sections** with section codes (e.g., HIST-ANC, HIST-MED, GEO-PHY, POL-CON)
- Seeds **71 topics** with topic codes mapped to registry CSV micro-topic IDs
- All content is **bilingual** (English + Telugu)
- Groups 2, 3, 4 created as categories (ready for future content)

### APPSC Group 1 Structure Seeded
```
APPSC Group 1
├── History & Culture (HIST)
│   ├── Ancient India (10 topics)
│   ├── Medieval India (5 topics)
│   ├── Modern India (4 topics)
│   └── AP History (5 topics)
├── Geography (GEO)
│   ├── Physical Geography (4 topics)
│   └── Economic Geography (3 topics)
├── Polity & Governance (POL)
│   ├── Indian Constitution (8 topics)
│   └── Ethics & Public Admin (6 topics)
├── Economy (ECON)
│   ├── Indian Economy (8 topics)
│   └── AP Economy (5 topics)
├── Science & Technology (SCI)
│   ├── Science & Technology (7 topics)
│   └── Environment (2 topics)
└── Current Affairs & Aptitude (CA)
    ├── Aptitude & Mental Ability (3 topics)
    └── Current Events (1 topic)
```

### Archive Cleanup
- Consolidated 5 scattered doc folders into single `C:\GroupsGuru\archive\`
  - `old-planning-docs/` — Roadmaps, TDD, blueprints, old README
  - `old-sprint-closures/` — Sprint 0-13 closure reports
  - `old-architecture/` — Architecture docs, PYQ data, registry CSVs
  - `old-plans/` — 5 archived plans + master sprint plan v2
  - `old-reference/` — TDD v2, QB structure, execution plan
  - `old-repo/` — Sprint 1 zip backup
  - `old-postman/` — Postman collections
- Removed `Documents& plans&rules/`, `docs/`, `Repo/`, `postam/` folders
- **Nothing deleted** — all files preserved in `archive/`
- Clean root: only `Lms/`, `archive/`, `data/`, `.claude/`, `.vscode/`

### Fresh H2 Database
- Deleted old `lms_db.mv.db` (had stale generic categories)
- Fresh `groupsguru_db.mv.db` created on startup with full APPSC hierarchy
- 50 history questions auto-loaded from XML, registry micro-topics from CSVs

**Closure Date:** March 22, 2026

---

## Sprint 18 — Admin Content Tree + Student Browse Drill-Down ✅ DONE

> **Context:** Sprint 17a seeded the full APPSC Group 1 hierarchy (4 categories, 6 subjects, 14 sections, 71 topics, 50 questions), but there was no way for admins to manage it or students to browse through it. Admin pages showed only "Update Category" with no drill-down. Students clicking a category saw nothing.

### Part 1: Backend — Data Linking & New Endpoints

**MicroTopicLinker** (`com.groupsguru.config.MicroTopicLinker`)
- New `@Order(3)` CommandLineRunner that runs after DataSeeder
- Traverses all MicroTopics and links them to Topics via name matching
- Sets `topicId` on each MicroTopic, connecting CSV-imported micro-topics to the core hierarchy
- `QuestionDataLoader` bumped to `@Order(4)` to run after linking

**MicroTopic API — New Endpoint**
- `GET /api/registry/micro-topics/topic/{topicId}` — public, returns micro-topics for a topic
- `GET /api/admin/registry/micro-topics/topic/{topicId}` — admin version
- Updated: `MicroTopicRepository`, `MicroTopicService`, `MicroTopicController`, `AdminMicroTopicController`

**Question API — New Endpoint**
- `GET /api/questions/micro-topic/{microTopicId}` — public, returns questions for a micro-topic
- Updated: `QuestionRepository`, `QuestionService`, `QuestionController`

### Part 2: Admin — Content Hierarchy Tree Page

**`app/admin/content-tree/page.tsx`** — New interactive tree UI
- Lazy-loading expandable tree: Category → SubCategory → Section → Topic
- Inline Create / Edit / Delete modals at each hierarchy level
- Bilingual support (English + Telugu fields)
- Matches existing admin design system
- Dashboard card added to `app/admin/dashboard/page.tsx` for navigation

### Part 3: Student — Full Browse Drill-Down

**Frontend Library Updates**
- `lib/registry.ts` — Added `getMicroTopicsByTopic(topicId)`
- `lib/questions.ts` — Added `getByMicroTopicId(microTopicId)` and `getPublicAll()`

**Student Micro-Topics Page** (`app/student/categories/[id]/[subCategoryId]/[sectionId]/[topicId]/page.tsx`)
- Fixed broken drill-down: now properly fetches micro-topics by topicId
- Expandable MicroTopicCards with `<AnimatePresence>` animations
- On-demand question loading: click a micro-topic → fetches mapped questions
- Interactive click-to-reveal bilingual practice questions (EN + TE)
- Full student path now works: APPSC Group 1 → History & Culture → Ancient India → Pre-Historic Cultures → [micro-topics] → [questions]

### Known Issue Identified
- MicroTopicLinker uses broad name matching — Geography micro-topics with `topicName="India"` incorrectly link to Topic ID 1 ("Pre-Historic Cultures in India") due to substring overlap. Needs tighter matching logic in Sprint 19.

**Closure Date:** March 22, 2026

---

## Sprint 19 — MicroTopicLinker Fix + Publish/Order + Admin Questions CRUD ✅ DONE

> **Context:** Fixed loose string matching linking Geography to History. Added `isPublished` and `displayOrder` to Category, SubCategory, Section, and Topic. Built Publish toggle and sorting into the Admin Content Tree. Built a full CRUD overlay modal for the Admin Question Bank.

### Part 1: Backend — Publish/Order & Strict Linking
- **MicroTopicLinker:** Fixed substring matching bug by implementing a robust `normalize()` function that strips punctuation and handles varied whitespace. Mapped remaining orphans accurately by checking section context and keyword sharing.
- **Publish & Order:** Added `isPublished` and `displayOrder` to L0-L3 entities. Fixes were applied to `TopicRepository`, `SectionRepository`, and `SubCategoryRepository` to add missing JPA query methods for reordering.
- **Admin Endpoints:** Added `/toggle-publish` and `/reorder` endpoints. Updated services to use `findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc` for public endpoints and return everything for admin endpoints.

### Part 2: Frontend — Content Tree Update & Question CRUD
- **Content Tree UI:** Replaced basic row renderers with `isPublished` status toggles, `UP/DOWN` reorder arrows, and inline Create/Edit modals.
- **Question Bank CRUD:** Replaced static Table with an interactive dashboard that opens `QuestionModal.tsx`. 20-field form implemented with dropdowns for difficulty/type/levels.

**Closure Date:** March 22, 2026
**Verification:** Backend compiles successfully with `mvn clean compile`. Auth logic correctly filters non-published content for students while allowing Admin full visibility. Micro-topics are now correctly linked to their respective topics regardless of source CSV formatting.

---

## Sprint 20 — Intelligence Engine Upgrade (Content Gaps & Heatmaps) ✅ DONE
> **Context:** The Intelligence Engine currently displays prediction scores calculated from CSV data. This sprint upgrades it into an actionable "Content Generation Guide" for admins. It identifies topics with 0 questions (gaps), generates AI prompts for those gaps, and visualizes overall syllabus coverage.

### Backend:
- [x] **Content Gap Analysis:**
  - New DTO `ContentGapDTO` (topicId, topicName, subject, predictionConfidence, questionCount).
  - New endpoint `GET /api/admin/intelligence/content-gaps` — returns topics with `questionCount == 0`, sorted by `predictionConfidence` DESC.
- [x] **Coverage Stats:**
  - New endpoint `GET /api/admin/intelligence/coverage` — returns subject-wise breakdown of (Total Topics, Covered Topics, Total Questions).
- [x] **Manual Overrides:**
  - `PUT /api/admin/intelligence/predictions/{id}/notes` — allow admins to add qualitative analysis notes.
  - `PUT /api/admin/intelligence/predictions/{id}/priority-tweak` — allow manual score adjustment for "Current Affairs Hot" topics.

### Frontend:
- [x] **Intelligence Dashboard Enhancements:**
  - Add "Content Gaps" tab.
  - Interactive list of top 20 priority gaps.
  - "Copy AI Prompt" button: Generates a specialized Claude/Gemini prompt for that specific micro-topic.
- [x] **Syllabus Heatmap (Coverage Bars):**
  - Visual subject-wise coverage percentage with progress bars (Red to Green intensity).
- [x] **Priority Export:**
  - "Export Priority CSV" button for urgent gaps.

### Mobile:
- [x] Update Admin Intelligence screen to show "Priority Gaps" and "Coverage Stats" lists.
- [x] Triple-tab view: Preds, Gaps, Stats — consistent with web dashboard.

### CORS Fix (Post-Sprint):
- Updated `application.yaml` default `app.cors.allowed-origins` to include both `http://localhost:3000` and `http://localhost:3006`.
- CorsConfig already supported comma-separated origins; no Java changes needed.

**Closure Date:** March 24, 2026
**Verification:** Backend compiles cleanly (`mvn clean compile`). Login works. Intelligence endpoints (`/coverage`, `/content-gaps`, `/predictions`) return correct data. CORS allows requests from port 3006. Frontend Intelligence Dashboard loads at `/admin/intelligence`.

### API Endpoints Added:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/intelligence/content-gaps` | Content gaps (micro-topics with 0 questions) |
| GET | `/api/admin/intelligence/coverage` | Subject-wise coverage stats |
| PUT | `/api/admin/intelligence/predictions/{id}/notes` | Update admin analysis notes |
| PUT | `/api/admin/intelligence/predictions/{id}/priority-tweak` | Manual priority override |

---

## Sprint 21a — Frontend Redesign: Foundation + Auth ✅ DONE

> **Context:** Complete visual redesign mirroring Claude Code's aesthetic. Flat, restrained, border-based. Warm dark palette (#191919 base) with Anthropic amber accent (#D97706). Sprint 20a (simple reskin) was replaced by this comprehensive redesign.

### Design System Established

**Web (`globals.css` @theme):**
- Background palette: #191919 (base) → #1E1E1E (surface) → #2D2D2D (elevated) → #363636 (overlay) → #141414 (inset)
- Accent: #D97706 (primary), #F59E0B (hover)
- Borders: 1px solid #3A3A3A (no shadows for depth)
- Typography: Instrument Serif (display), Plus Jakarta Sans (body), JetBrains Mono (mono)
- Animation: Almost none — content renders instantly, only modals/dropdowns animate (150ms)

**Mobile (`src/theme/tokens.ts`):**
- Identical color values to web for cross-platform consistency
- Spacing, radii, and typography scale defined

### Web Files (12):
1. ✅ `app/globals.css` — Complete design token system
2. ✅ `app/layout.tsx` — Instrument Serif + Plus Jakarta Sans + JetBrains Mono fonts
3. ✅ `lib/motion.ts` — Shared animation presets (subtle + layout only)
4. ✅ `components/ui/Logo.tsx` — Geometric G mark (concentric arcs) + wordmark
5. ✅ `components/ui/AnimatedInput.tsx` — Flat input, label-above, no glow
6. ✅ `components/ui/LanguageToggle.tsx` — Pill toggle with accent highlight
7. ✅ `components/ui/Skeleton.tsx` — Pulse loader with #2D2D2D
8. ✅ `components/ui/Sidebar.tsx` — Flat sidebar, text-first nav, CONTENT/TOOLS/SYSTEM sections
9. ✅ `components/layout/ProtectedLayout.tsx` — 48px navbar + 260px sidebar + centered content
10. ✅ `components/auth/LoginForm.tsx` — Flat form, amber submit, error in #C74444
11. ✅ `app/login/page.tsx` — Centered card, serif welcome text
12. ✅ `app/page.tsx` — Clean landing with serif hero, architecture section, hierarchy grid

### Mobile Files (6):
1. ✅ `src/theme/tokens.ts` — Design tokens matching web
2. ✅ `src/components/ProfessionalLogo.tsx` — G mark + wordmark
3. ✅ `src/components/BackgroundGlow.tsx` — Returns null (removed)
4. ✅ `src/components/LanguageToggle.tsx` — Token-based styling
5. ✅ `src/screens/LoginScreen.tsx` — Complete redesign with flat card
6. ✅ `src/navigation/AppNavigator.tsx` — Token-based colors

**Closure Date:** March 25, 2026
**Verification:** Landing, login, admin dashboard, student dashboard all verified on web. Mobile login screen updated. No purple/#9333EA/#0f051d in 21a scope files. No glassmorphism or backdrop-blur.

---

## Sprint 21b — Frontend Redesign: Dashboards ✅ DONE

> **Context:** Redesigned the Admin and Student central hubs for both Web and Mobile platforms to align with the Claude Code mirror aesthetic. Removed complex animations, implemented flat-card layouts with 1px borders, and established the warm dark palette (#191919) as the absolute base.

### Web Files (2):
1. ✅ `app/admin/dashboard/page.tsx` — Standardized to 900px centered layout. Flat stats grid, Instrument Serif headers, amber progress markers.
2. ✅ `app/student/dashboard/page.tsx` — Dynamic commission selector with flat borders. Amber primary buttons. Bilingual welcome text support via Multilang.

### Mobile Files (2):
1. ✅ `src/screens/AdminDashboard.tsx` — Token-based redesign. Removed background glows. Flat grid navigation with amber detail icons.
2. ✅ `src/screens/StudentDashboard.tsx` — Clean, data-dense layout. Section headers with separator lines. Tokenized spacing and typography.

### Common Components (1):
1. ✅ `components/ui/Multilang.tsx` — Updated to intelligently handle fonts: English (Instrument Serif) fallback to Sans/Body font for Telugu to ensure legibility.

**Closure Date:** March 25, 2026
**Verification:** 
- No purple (#9333EA) remnants in dashboards.
- Hover states use border-color transitions instead of scaling.
- Typography correctly switches from Serif (EN) to Sans (TE) in titles.
- Mobile screens perfectly mirror the web design tokens.

---

## Sprint 21 — Production Readiness 📅

### Backend:
- [ ] Replace H2 with PostgreSQL
- [ ] Rotate `jwt.secret` to 256-bit random value
- [ ] `app.auth.cookie.secure=true`
- [ ] `app.cors.allowed-origins` = production domain
- [ ] `ddl-auto: validate` (not `create-drop`)
- [ ] Weekly PostgreSQL backup
- [ ] Flyway/Liquibase for versioned migrations
- [ ] Rate limiting
- [ ] Input validation on all endpoints
- [ ] Load test (100 concurrent exam attempts)

### Frontend:
- [ ] Set `NEXT_PUBLIC_API_URL` to production
- [ ] `npm run build` succeeds
- [ ] Error boundaries on all pages
- [ ] SEO meta tags
- [ ] Performance audit (Lighthouse)

### Mobile:
- [ ] Update API base URL to production
- [ ] Android release build (signed APK/AAB)
- [ ] iOS release build
- [ ] Error handling & crash reporting
- [ ] App icon & splash screen
- [ ] Play Store / App Store listing

---

## Sprint 20a — Frontend UI Reskin (claude.ai Dark + Warm Theme)

**Goal:** Completely reskin the GroupsGuru frontend to mirror claude.ai's UI/UX — warm dark theme (#1C1917), orange accent (#EA580C), DM Sans font, collapsible sidebar, clean layout, skeleton loading states. No purple, no glassmorphism, no spring physics.

**Logo:** Symmetric Crown Tree — balanced top-down hierarchy tree. Glowing root node at top, 3 inner nodes (L1), 6 outer nodes (L2), 12 small leaf dots (L3). Flat design (no 3D). Orange (#EA580C) nodes on dark (#1C1917). Connections as clean lines. Reference PNG: `groupsguru-logos-v2.png` (Variation A)

**Scope:** Frontend only (44 files: 41 modified + 3 new). No backend changes.

### Phase 0A: Logo Component (1 new file)
- **NEW** `components/ui/Logo.tsx` — SVG React component for Symmetric Crown Tree mark
  - Props: `size` (sm/md/lg), `showWordmark` (boolean)
  - Flat design: Root node (top), 3 L1 nodes, 6 L2 nodes, 12 L3 leaf dots. Lines connecting parent→child
  - All nodes: orange (#EA580C) circles, connections as SVG `<line>` elements
  - Wordmark: "Groups" `text-[#FAFAF9]` + "Guru" `text-[#EA580C]`, DM Sans bold

### Phase 0B: Layout Structure — Sidebar + Navbar
- **REWRITE** `components/layout/ProtectedLayout.tsx` — claude.ai mirror layout
  - Left Sidebar: 260px expanded / 0px collapsed, `#1C1917` bg, right border `#57534E/30`
    - Student nav: Dashboard, Categories, Exams, Results, Profile
    - Admin nav: Dashboard, Content Tree, Questions, Exams, Pricing, Intelligence, Migration
    - Active: `bg-[#292524] text-[#FAFAF9] border-l-2 border-[#EA580C]`
    - Inactive: `text-[#A8A29E] hover:bg-[#292524]/50`
  - Top Navbar: 56px, `bg-[#1C1917] border-b border-[#57534E]/30`, breadcrumbs + profile
  - Main content: `ml-[260px]` expanded, `ml-0` collapsed, `pt-[56px]`, `px-8 py-6`
- **NEW** `components/ui/Sidebar.tsx` — Extracted sidebar, `usePathname()`, localStorage collapse state
- **NEW** `components/ui/Skeleton.tsx` — `bg-[#292524] rounded-lg animate-pulse`, variants: text/card/avatar/button

### Phase 0C: Design System Foundation (2 files)
- `app/globals.css`:
  - `:root` vars: `--background: #1C1917`, `--foreground: #FAFAF9`
  - `@theme` block: bg-base, bg-surface, bg-elevated, border, accent, text tokens
  - `@import` DM Sans font (400, 500, 600, 700)
  - Autofill: `#292524`, caret `#EA580C`
  - Scrollbar: `rgba(234,88,12,0.3)`
  - Floating label: `#EA580C`
- `app/layout.tsx`:
  - `Inter` → `DM_Sans` from `next/font/google`, weights 400-700
  - Body bg: `#1C1917`
  - Remove cinematic purple/indigo blur orbs

### Phase 1: Shared Components (7 files)
- `AnimatedInput.tsx` — Remove spring, `bg-[#292524] border-[#57534E]/40 rounded-lg`, focus orange ring
- `CustomSelect.tsx` — `{ duration: 0.2, ease: "easeOut" }`, `bg-[#292524] rounded-lg`, selected orange
- `Modal.tsx` — `bg-[#292524] rounded-xl border-[#57534E]/40 shadow-2xl`
- `LanguageToggle.tsx` — `bg-[#292524] rounded-lg`, active `text-[#EA580C]`
- `PaywallModal.tsx` — Orange lock icon, solid `bg-[#EA580C]` button, Razorpay `#EA580C`
- `PriceBadge.tsx` — Premium: `bg-[rgba(234,88,12,0.1)] text-[#F97316]`
- `QuestionModal.tsx` — Inputs `bg-[#1C1917] border-[#57534E]/40`, save `bg-[#EA580C]`

### Phase 2: Auth Pages (4 files)
- `LoginForm.tsx` + `RegisterForm.tsx` — Remove spring, `bg-[#EA580C]` button, error `text-[#EF4444]`
- `login/page.tsx` + `register/page.tsx` — `bg-[#1C1917]`, card `bg-[#292524] rounded-xl`, no glassmorphism

### Phase 3: Exam Components (2 files)
- `ExamTimer.tsx` — `bg-[rgba(234,88,12,0.1)] text-[#F97316] rounded-lg`, `font-semibold`
- `QuestionNavPanel.tsx` — `bg-[#292524] rounded-lg`, current `bg-[#EA580C]`, CSS transitions

### Phase 4: Landing Page (1 file)
- `app/page.tsx` — `bg-[#1C1917]`, remove blur orbs, ghost login button, CTA `bg-[#EA580C]`, all purple → orange

### Phase 5: Student Pages (11 files)
- All student pages: cards `bg-[#292524] border-[#57534E]/30 rounded-xl`, hover orange, no spring/blur

### Phase 6: Admin Pages (14 files)
- All admin pages: "Add New" `bg-[#EA580C]`, rows `bg-[#292524]`, edit `bg-[#44403C]`, delete red

### Phase 7: Preview Pages (2 files, optional)
- `design-preview/page.tsx` + `typography-preview/page.tsx` — Update to new design system

### Global Find-Replace Reference
| Find | Replace |
|------|---------|
| `bg-[#0c051a]`, `bg-[#0a0114]`, `bg-[#0f051d]`, `bg-[#0f071a]`, `bg-[#12081f]`, `bg-[#1a0b2e]` | `bg-[#1C1917]` or `bg-[#292524]` |
| `border-purple-500/30`, `border-purple-500/20`, `border-white/10` | `border-[#57534E]/40` |
| `text-purple-400`, `text-purple-300`, `text-violet-400`, `text-indigo-400` | `text-[#F97316]` |
| `bg-gradient-to-r from-purple-600 to-indigo-600` | `bg-[#EA580C]` |
| `bg-gradient-to-r from-[#9333EA] to-[#DB2777]` | `bg-[#EA580C]` |
| All `shadow-[..._rgba(147,51,234,...)]` | `shadow-md` or `shadow-lg` |
| `rounded-[48px]`, `rounded-[32px]`, `rounded-[24px]` | `rounded-xl` |
| `backdrop-blur-xl`, `backdrop-blur-3xl`, `backdrop-blur-[100px]` | Remove |
| `font-black italic` | `font-semibold` |
| `stiffness: 420, damping: 24, mass: 0.8` | `duration: 0.25, ease: "easeOut"` |
| `whileHover={{ y: -10 }}` | `whileHover={{ y: -2 }}` or CSS |
| `#EC4899` (pink errors) | `#EF4444` (red) |

### Verification
1. `npm run dev` in `groupsguru-frontend/`
2. Check all pages visually — no purple/pink, warm dark + orange throughout
3. Search for `#9333EA`, `#DB2777`, `purple-`, `indigo-`, `pink-` — should find ZERO
4. Test sidebar collapse, skeleton loading, mobile responsiveness

**Total: 44 files (41 modified + 3 new) | No new dependencies | Font: DM Sans via next/font/google**

---

## Groups Guru Source Reference

**Source path:** `C:\Users\jayar\OneDrive\Desktop\groupsguru`

| Directory | Contents | Used In |
|-----------|----------|---------|
| `registry/` | 9 CSV files, 875+ micro-topics | Sprint 7 |
| `intelligence/analysis/` | prediction-scores.csv (162), g1-pyq-analysis.csv (188), g2-pyq-analysis.csv (224) | Sprint 8 |
| `intelligence/rulebook.md` | R1–R30 question generation rules | Reference |
| `intelligence/terminology.csv` | 200+ EN-TE exam terms | Reference |
| `questions/group-1/` | s11.1-history-ancient-medieval.xml (50 MCQs) | Sprint 9 |

**Prediction Engine Formula:**
```
Prediction_Confidence = 0.30 * Frequency + 0.15 * Depth + 0.25 * Recurrence + 0.15 * SyllabusPriority + 0.15 * TrendMomentum
```
