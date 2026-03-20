# GroupsGuru — LMS Mobile

**Version**: Sprint 2 (Category done, SubCategory next)
**Stack**: React Native 0.84 · React 19 · React Navigation 7 · TypeScript · Axios
**Updated**: 2026-03-20

> **Sprint Plan:** See [`../SPRINTS.md`](../SPRINTS.md) for the master vertical-slice sprint plan (Backend + Frontend + Mobile per sprint).

---

## Overview

This is the **React Native mobile app** for GroupsGuru — the APPSC Group 1/2/3/4 intelligent exam preparation engine. It mirrors the web frontend's functionality with the same dark violet/indigo design system.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.84.0 |
| UI Library | React | 19.2.3 |
| Navigation | React Navigation (Native Stack) | 7.x |
| HTTP Client | Axios | 1.13.5 |
| Language | TypeScript | 5.8.3 |
| State | React Context API | built-in |
| Build | Metro | default |
| Node | >= 22.11.0 | required |

---

## Getting Started

```bash
npm install

# Android
npm run android

# iOS
npm run ios
```

---

## API Configuration

In `src/api/api.ts`, update the base URL:
```typescript
baseURL: "http://<YOUR_LOCAL_IP>:8080"  // Use machine IP, not localhost
```

---

## Project Structure

```
src/
├── api/
│   ├── api.ts                     # Axios instance (withCredentials: true)
│   ├── categoryService.ts         # Category API methods                ✅ Sprint 2
│   ├── subCategoryService.ts      # SubCategory API methods             ← Sprint 3
│   ├── sectionService.ts          # Section API methods                 ← Sprint 4
│   ├── topicService.ts            # Topic API methods                   ← Sprint 5
│   ├── registryService.ts         # MicroTopic/Registry API methods     ← Sprint 6
│   ├── examService.ts             # Exam API methods                    ← Sprint 10
│   └── types.ts                   # TypeScript interfaces
├── components/                    # Reusable components (empty — to build)
│   ├── LanguageToggle.tsx         # EN/TE toggle button                 ← Sprint 3
│   ├── ExamTimer.tsx              # Countdown timer                     ← Sprint 11
│   ├── QuestionCard.tsx           # Bilingual question + options        ← Sprint 11
│   ├── OptionButton.tsx           # Selectable answer option            ← Sprint 11
│   └── CircularProgress.tsx       # Score display                       ← Sprint 12
├── context/
│   ├── AuthContext.tsx             # Auth state (JWT, role, user)        ✅ Sprint 1
│   └── LanguageContext.tsx         # EN/TE language state                ← Sprint 3
├── navigation/
│   └── AppNavigator.tsx           # Stack navigator + auth routing      ✅ Sprint 1
├── screens/
│   ├── LoginScreen.tsx            # Login form                          ✅ Sprint 1
│   ├── AdminDashboard.tsx         # Admin placeholder                   ✅ Sprint 1
│   ├── StudentDashboard.tsx       # Student placeholder                 ✅ Sprint 1
│   ├── CategoryScreen.tsx         # Category listing                    ✅ Sprint 2
│   ├── SubCategoryScreen.tsx      # SubCategory listing                 ← Sprint 3
│   ├── SectionScreen.tsx          # Section listing                     ← Sprint 4
│   ├── TopicScreen.tsx            # Topic listing                       ← Sprint 5
│   ├── MicroTopicScreen.tsx       # MicroTopic listing                  ← Sprint 6
│   ├── ExamListScreen.tsx         # Browse exams                        ← Sprint 10
│   ├── ExamDetailScreen.tsx       # Exam info + start                   ← Sprint 10
│   ├── ExamAttemptScreen.tsx      # Quiz-taking interface               ← Sprint 11
│   ├── ExamResultScreen.tsx       # Score + breakdown                   ← Sprint 12
│   └── IntelligenceScreen.tsx     # Admin: predictions view             ← Sprint 8
└── theme/                         # Centralized theme (empty — to build)
    └── colors.ts                  # Color constants                     ← Sprint 3
```

---

## Auth System

- JWT stored in HttpOnly cookie (set by backend, Axios sends automatically with `withCredentials: true`)
- `AuthContext` calls `/api/auth/me` on mount to restore session
- `AppNavigator` routes based on `user.role`: ADMIN → `AdminDashboard`, STUDENT → `CategoryScreen`
- Roles normalized to `"ADMIN"` | `"STUDENT"`

---

## Design System (Must Match Web Frontend)

| Token | Value (React Native) |
|-------|---------------------|
| Background | `#0f051d` |
| Primary | `#9333EA` (purple) |
| Secondary | `#DB2777` (pink) |
| Accent | `#EC4899` |
| Card background | `rgba(147, 51, 234, 0.08)` |
| Card border | `rgba(147, 51, 234, 0.2)` |
| Card radius | `borderRadius: 24` |
| Text primary | `#FFFFFF` |
| Text muted | `rgba(255,255,255,0.6)` |
| Input background | `#1e102f` |
| Font weight heading | `"800"` |
| Font weight body | `"600"` |

**CRITICAL:** All new screens MUST use these exact colors and styles. Match the web frontend's visual language.

---

## Mobile Sprint Status

| Sprint | Feature | Status |
|--------|---------|--------|
| Sprint 1 | Auth (Login + AuthContext + Navigator) | ✅ Done |
| Sprint 2 | Category Screen (FlatList + cards) | ✅ Done |
| Sprint 3 | SubCategory + LanguageContext + Toggle | ❌ **Catch-up needed** |
| Sprint 4 | Section Screen | ❌ **Catch-up needed** |
| Sprint 5–12 | See [`../SPRINTS.md`](../SPRINTS.md) | 📅 |

---

## Navigation Flow (Current → Planned)

```
Current:
  Login → [Admin] AdminDashboard
        → [Student] CategoryScreen (dead end)

After Sprint 5:
  Login → [Admin] AdminDashboard
        → [Student] CategoryScreen → SubCategoryScreen → SectionScreen → TopicScreen → MicroTopicScreen

After Sprint 11:
  Login → [Admin] AdminDashboard → IntelligenceScreen
        → [Student] CategoryScreen → ... → MicroTopicScreen
                    ExamListScreen → ExamDetailScreen → ExamAttemptScreen → ExamResultScreen
```

---

## Production Build

```bash
# Android
npx react-native build-android --mode=release

# iOS
npx react-native build-ios --mode=release
```

> Update API base URL to production before building.
