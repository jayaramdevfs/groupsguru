# GroupsGuru LMS — Master Sprint Plan (Vertical Slices)

**Updated**: 2026-03-20
**Architecture**: Vertical Slicing — each sprint delivers Backend + Frontend + Mobile together

---

## Mandatory Sprint Closure (MANDATORY)

Every sprint **MUST** conclude with the following steps BEFORE being marked as done:
1. **Doc Update**: Update `SPRINTS.md` status table.
2. **Post-Implementation Documentation**: Detail any architectural changes in sprint deliverables if they differ from initial plans.
3. **Git Commit & Push**: Commit all files with the message: `Sprint X complete: [Key feature]`.
4. **Final Verification**: Ensure the vertical slice (Backend + Frontend + Mobile) is functional.

---

## Platform Stack

| Platform | Stack | Port |
|----------|-------|------|
| **Backend** | Spring Boot 3.2.5 · Java 17 · H2/PostgreSQL · JWT | 8080 |
| **Frontend** | Next.js 16 · React 19 · Tailwind CSS 4 · Framer Motion | 3000 |
| **Mobile** | React Native 0.84 · React Navigation 7 · Axios | — |

---

## Project Directories

```
C:\LMS PLATFORM\Lms\
├── lms-backend/       → Spring Boot API
├── lms-frontend/      → Next.js web app
└── lmsMobile/         → React Native mobile app
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
| 5 | Topic (L3) | 📅 Planned | 📅 Planned | 📅 Planned |
| 6 | MicroTopic (L4) | 📅 Planned | 📅 Planned | 📅 Planned |
| 7 | Registry Data Migration | 📅 Planned | 📅 Planned | 📅 Planned |
| 8 | Intelligence Engine | 📅 Planned | 📅 Planned | 📅 Planned |
| 9 | Question Bank | 📅 Planned | 📅 Planned | 📅 Planned |
| 10 | Exam Structure | 📅 Planned | 📅 Planned | 📅 Planned |
| 11 | Student Exam Flow | 📅 Planned | 📅 Planned | 📅 Planned |
| 12 | Results & Analytics | 📅 Planned | 📅 Planned | 📅 Planned |
| 13 | Production Readiness | 📅 Planned | 📅 Planned | 📅 Planned |

**Resume Point:** Start Sprint 5 (all 3 platforms).

### Execution Order:
```
Sprint 5 (all 3 platforms) -> Sprint 6 -> ... -> Sprint 13
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

## Design System (All Platforms Must Match)

| Token | Value |
|-------|-------|
| Background | `#0f051d` (backend sends no UI, but mobile+web must match) |
| Primary gradient | `violet-600 → indigo-600` / `#9333EA → #4f46e5` |
| Accent gradient | `#9333EA → #DB2777` |
| Card background | `rgba(147, 51, 234, 0.08)` — web: `bg-white/[0.03]` |
| Card border | `rgba(147, 51, 234, 0.2)` — web: `border-white/10` |
| Card radius | 24px (mobile) / `rounded-[32px]` (web) |
| Text primary | `#FFFFFF` |
| Text muted | `rgba(255,255,255,0.6)` |
| Input background | `#1e102f` (mobile) / `#0f071a` (web) |
| Font weight heading | 800 |
| Font weight body | 600 |
| Spring config (web) | `stiffness: 420, damping: 24, mass: 0.8` |

**CRITICAL:** Do NOT introduce new colors, fonts, or design patterns. All new screens adopt the existing system.

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

## Sprint 5 — Topic Layer (L3) 📅 FULL VERTICAL SLICE

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

## Sprint 6 — MicroTopic Entity & CRUD (L4) 📅 FULL VERTICAL SLICE

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

---

## Sprint 7 — Registry Data Migration 📅 FULL VERTICAL SLICE

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

## Sprint 8 — Intelligence Engine (PYQ Analysis + Prediction Engine) 📅 FULL VERTICAL SLICE

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

**Verification:** `SELECT COUNT(*) FROM prediction_score` = **162**, `SELECT COUNT(*) FROM pyq_analysis` = **412**. `recalculateAllScores()` output matches original CSV.

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

## Sprint 10 — Exam Structure 📅 FULL VERTICAL SLICE

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

**Verification:** 2 sample exams visible on all 3 platforms. Admin can create exams and assign questions.

---

## Sprint 11 — Student Exam Flow 📅 FULL VERTICAL SLICE

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

**Verification:** Start exam → answer questions → submit → score matches manual calculation. Test negative marking. Test auto-submit on timer expiry. Test on all 3 platforms.

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

**Verification:** Results display correctly on all platforms. Scores match. Topic breakdown is accurate.

---

## Sprint 13 — Production Readiness 📅

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

## Groups Guru Source Reference

**Source path:** `C:\Users\jayar\OneDrive\Desktop\groupsguru`

| Directory | Contents | Used In |
|-----------|----------|---------|
| `registry/` | 9 CSV files, 875 micro-topics | Sprint 7 |
| `intelligence/analysis/` | prediction-scores.csv (162), g1-pyq-analysis.csv (188), g2-pyq-analysis.csv (224) | Sprint 8 |
| `intelligence/rulebook.md` | R1–R30 question generation rules | Reference |
| `intelligence/terminology.csv` | 200+ EN-TE exam terms | Reference |
| `questions/group-1/` | s11.1-history-ancient-medieval.xml (50 MCQs) | Sprint 9 |

**Prediction Engine Formula:**
```
Prediction_Confidence = 0.30 * Frequency + 0.15 * Depth + 0.25 * Recurrence + 0.15 * SyllabusPriority + 0.15 * TrendMomentum
```
