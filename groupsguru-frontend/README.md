# GroupsGuru — Web Frontend

**Version**: Sprint 4 (Complete)
**Stack**: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP
**Updated**: 2026-03-20

> **Sprint Plan:** See [`../SPRINTS.md`](../SPRINTS.md) for the master vertical-slice sprint plan (Backend + Frontend + Mobile per sprint).

---

## Overview

This is the **Web Frontend** for GroupsGuru — the APPSC Group 1/2/3/4 intelligent exam preparation engine. Built with Next.js App Router, it provides:

- A premium **dark violet/indigo** glassmorphism UI with a **Global Grid** background
- **Cinematic "Living Radar" Logo**: Physics-based canvas animation with phosphor sweep
- **3-Tier Package Model**: Prelims, Mains, and Complete bundles for all categories
- **Bilingual** support (English ↔ Telugu) on all dynamic content
- **Role-based** views: Admin panel and Student dashboard
- Smooth animations via **Framer Motion** and **GSAP**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12, GSAP 3, Lenis (smooth scroll) |
| HTTP Client | Axios |
| State | React Context (Auth, Language) |
| Fonts | System + Inter via CSS |

---

## Getting Started

```bash
npm install
npm run dev
```

App starts at **http://localhost:3000**

---

## Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Route Map

```
/                                → Public landing page (GroupsGuru hero + hierarchy)
/login                           → Login / register page

/admin/
  dashboard/                     → Admin dashboard (stats + nav cards)
  categories/                    → Admin: manage exam categories (L0)       ✅ Sprint 2
  subcategories/                 → Admin: manage subjects (L1)              ✅ Sprint 3
  sections/                      → Admin: manage sections (L2)              🚧 Sprint 4
  topics/                        → Admin: manage topics (L3)                ← Sprint 5
  micro-topics/                  → Admin: manage micro-topics (L4)          ← Sprint 6
  questions/                     → Admin: question bank management          ← Sprint 9
  intelligence/                  → Admin: prediction dashboard              ← Sprint 10

/student/
  dashboard/                     → Student dashboard (stats + nav)
  categories/                    → Student: browse exam categories           ✅ Sprint 2
  subcategories/                 → Student: browse subjects                  ✅ Sprint 3
  exams/                         → Student: browse available exams           ← Sprint 10
  exams/[id]/                    → Student: exam detail + start              ← Sprint 10
  exams/[id]/attempt/            → Student: quiz-taking interface            ← Sprint 11
  exams/[id]/results/            → Student: score + topic breakdown          ← Sprint 12
```

---

## Component Architecture

```
components/
├── layout/
│   └── ProtectedLayout.tsx        # Role-gated wrapper (ADMIN | STUDENT)
├── ui/
│   ├── AnimatedInput.tsx           # Spring-animated input field
│   ├── LanguageToggle.tsx          # EN / TE toggle button
│   ├── Modal.tsx                   # Reusable dialog overlay
│   └── Multilang.tsx               # <Multilang en="..." te="..." /> component
├── exam/                           # ← Sprint 10+
│   ├── ExamCard.tsx
│   ├── QuestionDisplay.tsx
│   ├── ExamTimer.tsx
│   ├── QuestionNavPanel.tsx
│   └── ResultBreakdown.tsx

app/
├── context/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── login/page.tsx
├── admin/
│   ├── dashboard/page.tsx
│   ├── categories/page.tsx
│   ├── subcategories/page.tsx
│   ├── sections/page.tsx           🚧 Sprint 4
│   ├── topics/page.tsx             ← Sprint 5
│   ├── micro-topics/page.tsx       ← Sprint 6
│   ├── questions/page.tsx          ← Sprint 9
│   └── intelligence/page.tsx       ← Sprint 10
└── student/
    ├── dashboard/page.tsx
    ├── categories/page.tsx
    ├── subcategories/page.tsx
    └── exams/                      ← Sprint 10–12

lib/
├── api.ts                          # Axios instance with credentials
├── auth.ts
├── types.ts
├── categories.ts
├── subcategories.ts
├── sections.ts                     🚧 Sprint 4
├── topics.ts                       ← Sprint 5
├── registry.ts                     ← Sprint 6
├── questions.ts                    ← Sprint 9
└── exams.ts                        ← Sprint 10
```

---

## Bilingual System

```tsx
import { Multilang } from "@/components/ui/Multilang";

<Multilang en="Exam Categories" te="పరీక్షా కేటగిరీలు" />
```

`LanguageContext` holds the active language (`"en"` or `"te"`). `LanguageToggle` switches globally.

---

## Auth System

- JWT stored in HttpOnly cookie (set by backend)
- `AuthContext` reads `/api/auth/me` on mount
- `ProtectedLayout` wraps protected routes, redirects if role mismatch

```tsx
<ProtectedLayout requiredRole="ADMIN">
  {/* admin-only content */}
</ProtectedLayout>
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0114` |
| Primary gradient | `violet-600 → indigo-600` |
| Accent gradient | `#9333EA → #DB2777` |
| Card background | `rgba(147, 51, 234, 0.1)` or `bg-white/[0.03]` |
| Card border | `rgba(147, 51, 234, 0.25)` or `border-white/10` |
| Card radius | `rounded-[32px]` |
| Input background | `bg-[#0f071a]` |
| Input border | `border-purple-500/30` |
| Input radius | `rounded-2xl` |
| Text primary | `#ffffff` |
| Text muted | `rgba(255,255,255,0.6)` |
| Spring config | `stiffness: 420, damping: 24, mass: 0.8` |
| Font | Inter (weights: 600, 700, 800) |
| Shadows | Purple glow: `rgba(147,51,234,0.3)` |
| Blur orbs | `blur-[120px]` background decorations |
| Backdrop | `backdrop-blur-xl` on cards |

**CRITICAL:** All new pages and components MUST use these exact design tokens. Do NOT introduce new color schemes.

---

## Frontend Sprint Status

| Sprint | Feature | Status |
|--------|---------|--------|
| Sprint 1 | Auth UI (Login/Register) | ✅ Done |
| Sprint 2 | Category Management UI (L0) | ✅ Done |
| Sprint 3 | SubCategory Management UI (L1) | ✅ Done |
| Sprint 4 | Section Management UI (L2) + Student Drill-Down | ✅ Done |
| Sprint 5–12 | See [`../SPRINTS.md`](../SPRINTS.md) | 📅 |

---

## Production Build

```bash
npm run build
npm run start
```

> Set `NEXT_PUBLIC_API_URL` to the production backend URL before building.
