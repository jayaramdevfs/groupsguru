# Sprint 21 — Complete Frontend Redesign Plan

**Status:** In Progress
**Date:** 2026-03-25
**Scope:** Frontend only (Web + Mobile). Backend untouched.
**Approach:** Vertical slicing — each sub-sprint delivers a complete user flow in the new design.

---

## Why This Redesign

Sprint 20a attempted a "color reskin" (purple → dark orange) but it was superficial:
- **Web**: Hardcoded hex colors everywhere. Remnants of old purple theme in AnimatedInput (`rgba(147,51,234,0.4)` glow), Modal (purple borders), PaywallModal.
- **Mobile**: **Never updated** — still entirely on the old purple theme (`#0f051d` bg, `#9333EA` buttons).
- **No design system** — no shared tokens between web and mobile.
- **Generic aesthetic** — just a color palette swap on dark background, not a real design identity.

**Decision:** Complete visual redesign from zero. Mirror Claude Code's design language exactly.

---

## Aesthetic Direction: "Claude Code Mirror"

Mirror the Anthropic Claude Code interface — clean, refined, flat, restrained:
- **Flat everything** — no gradients, no glow, no decorative orbs, no glassmorphism
- **Border-based** — 1px borders instead of shadows for depth
- **Restrained animation** — content appears instantly, animations only for modals/dropdowns
- **Centered content** — max-width 900px centered, generous whitespace
- **Warm precision** — deep near-black base with Anthropic amber accent

---

## Design Token Specification

### Colors (Claude Code Palette)

| Token | Hex | Usage |
|-------|-----|-------|
| **Backgrounds** | | |
| `--color-base` | `#191919` | Page background |
| `--color-surface` | `#1E1E1E` | Cards, sidebar |
| `--color-elevated` | `#2D2D2D` | Modals, dropdowns |
| `--color-overlay` | `#363636` | Hover states |
| `--color-inset` | `#141414` | Input backgrounds |
| **Foregrounds** | | |
| `--color-fg-primary` | `#E8E8E8` | Primary text |
| `--color-fg-secondary` | `#A0A0A0` | Secondary text |
| `--color-fg-muted` | `#666666` | Placeholder, disabled |
| `--color-fg-faint` | `#3A3A3A` | Borders, dividers |
| **Accent** | | |
| `--color-accent` | `#D97706` | Buttons, active states |
| `--color-accent-hover` | `#F59E0B` | Hover variant |
| `--color-accent-subtle` | `rgba(217,119,6,0.12)` | Accent backgrounds |
| `--color-accent-border` | `rgba(217,119,6,0.25)` | Accent borders |
| **Semantic** | | |
| `--color-success` | `#3D9A5F` | Correct, success |
| `--color-warning` | `#C4901A` | Warnings |
| `--color-error` | `#C74444` | Errors, wrong answers |
| `--color-info` | `#4A8FBF` | Info badges |

### Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Display** | Instrument Serif | 400 | Hero headings, page titles, logo wordmark |
| **Body** | Plus Jakarta Sans | 400, 500, 600, 700 | All UI text |
| **Mono** | JetBrains Mono | 500 | Timer, stats, codes |

### Layout Constants

| Element | Value |
|---------|-------|
| Border radius (default) | 8px |
| Border radius (modal) | 12px |
| Border radius (pill) | 9999px |
| Sidebar width | 260px (collapsible to 0px) |
| Top navbar height | 48px |
| Content max-width | 900px centered |
| Content padding (desktop) | 32px |
| Content padding (mobile) | 16px |

### Animation Rules

| What | Animation | Duration |
|------|-----------|----------|
| Page content | **None** — renders instantly | 0ms |
| Card stagger | **None** — all cards appear at once | 0ms |
| Hover effects | Border-color change only | 150ms CSS |
| Sidebar collapse | Width transition | 200ms |
| Modal open | Opacity + scale(0.98→1) | 150ms |
| Dropdown open | Opacity + y(-4→0) | 150ms |
| **REMOVED** | All `whileHover` scale/translate | — |
| **REMOVED** | All background orbs/blurs | — |
| **REMOVED** | All `initial/animate` on page content | — |

---

## Layout Structure

### Web (Claude Code Clone)

```
+--[Sidebar 260px]--+--[Content Area]--------------------------------+
|                    | [Navbar 48px: hamburger + page name | lang + logout]|
| Logo               |------------------------------------------------|
|                    |                                                |
| CONTENT            |   [Content max-width: 900px, centered]        |
|  Categories        |                                                |
|  Content Tree      |   Page content here...                        |
|  Questions         |                                                |
|                    |                                                |
| TOOLS              |                                                |
|  Exams             |                                                |
|  Intelligence      |                                                |
|  Pricing           |                                                |
|                    |                                                |
| SYSTEM             |                                                |
|  Migration         |                                                |
+--------------------+------------------------------------------------+
```

- Sidebar: flat `#1E1E1E` bg, 1px right border, text-first nav (minimal icons)
- Navbar: flat `#191919` bg, 1px bottom border, no shadow
- Content: scrolls naturally, no custom scroll behaviors

### Mobile

```
+--[Top Header 48px: logo | lang toggle]--+
|                                          |
|   Stack navigation content               |
|   (full-width cards, 16px margin)        |
|                                          |
+--[Bottom Tabs: Dashboard | Browse | Exams | Profile]--+
```

- Flat bottom tab bar, accent dot for active tab
- No sidebar on mobile

### Landing Page (Public)
- Centered, generous whitespace
- Large Instrument Serif heading
- Minimal decoration — no orbs, no gradients
- Simple CTA buttons

### Login Page
- Centered card on dark bg
- Label-above inputs (no floating labels)
- Single amber submit button
- Logo wordmark above form

---

## Logo

**New**: Geometric "G" mark — concentric arcs evoking hierarchy levels + upward trajectory.
**Wordmark**: "Groups" (light text) + "Guru" (amber), in Instrument Serif.

---

## Sub-Sprint Breakdown

### Sprint 21a — Foundation + Auth Flow
**Vertical slice**: Landing page → Login → Dashboard shell (both platforms)

**Web files (12)**:
1. `app/globals.css` — Complete rewrite with design tokens
2. `app/layout.tsx` — New fonts (Instrument Serif + Plus Jakarta Sans + JetBrains Mono)
3. `lib/motion.ts` — **NEW** shared animation presets
4. `components/ui/Logo.tsx` — New SVG logo + wordmark
5. `components/ui/AnimatedInput.tsx` — Flat input, no glow, label-above pattern
6. `components/ui/LanguageToggle.tsx` — Restyle with tokens
7. `components/ui/Skeleton.tsx` — Update colors
8. `components/ui/Sidebar.tsx` — New flat sidebar, text-first nav, section groups
9. `components/layout/ProtectedLayout.tsx` — New layout shell (48px navbar, centered content)
10. `components/auth/LoginForm.tsx` — Restyle with tokens
11. `app/login/page.tsx` — Minimal centered login card
12. `app/page.tsx` — Clean landing page with serif hero

**Mobile files (6)**:
1. `src/theme/tokens.ts` — **NEW** design tokens for React Native
2. `src/components/ProfessionalLogo.tsx` — New logo matching web
3. `src/components/BackgroundGlow.tsx` — Keep as null (already is)
4. `src/components/LanguageToggle.tsx` — Restyle with tokens
5. `src/screens/LoginScreen.tsx` — Complete redesign
6. `src/navigation/AppNavigator.tsx` — Update colors

---

### Sprint 21b — Dashboards (Admin + Student)
**Vertical slice**: Both dashboards fully redesigned

**Web (3)**: `app/admin/dashboard/page.tsx`, `app/student/dashboard/page.tsx`, `components/ui/Multilang.tsx`
**Mobile (2)**: `src/screens/AdminDashboard.tsx`, `src/screens/StudentDashboard.tsx`

---

### Sprint 21c — Content Browse Flow
**Vertical slice**: Categories → SubCategories → Sections → Topics → MicroTopics

**Web (8)**: 5 student category pages + `PriceBadge.tsx` + `PaywallModal.tsx` + `Modal.tsx`
**Mobile (7)**: 5 browse screens + `PriceBadge.tsx` + `PaywallModal.tsx`

---

### Sprint 21d — Exam Flow
**Vertical slice**: Exam list → Detail → Attempt → Results

**Web (6)**: 4 exam pages + `ExamTimer.tsx` + `QuestionNavPanel.tsx`
**Mobile (4)**: 4 exam screens

---

### Sprint 21e — Admin Management Pages
**Vertical slice**: All admin CRUD + Intelligence dashboard

**Web (14)**: 12 admin pages + `QuestionModal.tsx` + `CustomSelect.tsx`
**Mobile (2)**: `IntelligenceScreen.tsx` + `QuestionListScreen.tsx`

---

### Sprint 21f — Register + Polish + Final QA
**Vertical slice**: Register flow + purge all old colors

**Web (5)**: `register/page.tsx`, `RegisterForm.tsx`, preview pages, global color grep
**Mobile (2)**: `FormattedQuestionText.tsx`, global color grep

---

## Summary Table

| Sub-Sprint | Scope | Web Files | Mobile Files |
|------------|-------|-----------|--------------|
| 21a | Foundation + Auth | 12 | 6 |
| 21b | Dashboards | 3 | 2 |
| 21c | Content Browse | 8 | 7 |
| 21d | Exam Flow | 6 | 4 |
| 21e | Admin Pages | 14 | 2 |
| 21f | Register + Polish | 5 | 2 |
| **Total** | | **48** | **23** |

**71 total file modifications + 2 new files**

---

## What Stays Unchanged

- **Backend**: All Spring Boot code, API endpoints, database models — zero changes
- **API client library**: All `lib/*.ts` files (api.ts, types.ts, auth.ts, categories.ts, etc.) — keep as-is
- **Context providers**: AuthContext, LanguageContext — logic stays, only visual wrappers change
- **Routing**: Same pages, same routes, same URL structure
- **Business logic**: All data fetching, state management, form handling logic inside pages
- **Bilingual**: Multilang component concept stays, just restyled

---

## Verification Checklist (Per Sub-Sprint)

1. `cd Lms/groupsguru-frontend && npm run dev` — web renders correctly on localhost:3000
2. `cd Lms/groupsguru-mobile && npx react-native run-android` — mobile renders correctly
3. **Visual**: All pages in that sprint's slice show new Claude Code design
4. **Token grep**: Zero matches for old hex colors (`#1C1917`, `#292524`, `#EA580C`, `#9333EA`, `#0f051d`) in modified files
5. **Functionality**: All API calls, navigation, auth flows work identically
6. **Telugu**: Language toggle works, Telugu text renders properly
7. **Mobile-Web parity**: Same visual language on both platforms

---

## Mobile-Web Alignment

1. **Shared tokens**: `globals.css @theme` (web) and `src/theme/tokens.ts` (mobile) define identical values
2. **Component naming**: Logo, LanguageToggle, PriceBadge, PaywallModal — same names both platforms
3. **Per-sprint sync**: Every sprint modifies BOTH web AND mobile for the same flow
4. **Layout adaptation**: Mobile uses bottom tabs (native), web uses sidebar — same visual language
5. **Telugu**: Instrument Serif for English display headings only; Telugu falls back to Plus Jakarta Sans (web) or system Noto Sans Telugu (mobile)
