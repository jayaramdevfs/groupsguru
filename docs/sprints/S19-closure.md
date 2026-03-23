---
title: "Sprint 19 Closure"
date: "2026-03-22"
description: "MicroTopicLinker Fix + Publish/Order + Admin Questions CRUD"
---

# Sprint 19: Content Refinement & Question Management

## Objectives Achieved

1. **MicroTopicLinker Robustness:**
   - Fixed the substring matching bug where Geography topics were incorrectly linking to History topics.
   - Implemented a `normalize()` function to handle varied whitespace and punctuation in names.
   - Added section-aware matching to ensure micro-topics are linked to the correct parent hierarchy.

2. **Publish & Order Control:**
   - Added `isPublished` (boolean) and `displayOrder` (Integer) to `Category`, `SubCategory`, `Section`, and `Topic`.
   - Updated all respective Repositories and Services to support filtering by `isPublished=true` and `orderByDisplayOrderAsc` for public endpoints.
   - Admins can still see all content at any state.

3. **Admin Question Bank CRUD:**
   - Built a comprehensive management dashboard at `app/admin/questions/page.tsx`.
   - Developed `QuestionModal.tsx` supporting 20+ fields (difficulty, cognitive level, bilingual text, etc.).
   - Implemented Edit/Delete functionality with backend integration.

4. **Hierarchical Content Tree Updates:**
   - Enhanced `app/admin/content-tree/page.tsx` with publish toggles and reordering arrows.
   - Fixed drill-down navigation for students to handle the refined hierarchy.

## DB Schema Changes
- **Tables Modified:** `category`, `sub_category`, `section`, `topic`.
- **New Columns:** `is_published` (BOOLEAN, default TRUE), `display_order` (INT, default 0).

## API Endpoints Added/Updated
- `POST /api/admin/questions` — Create question
- `PUT /api/admin/questions/{id}` — Update question
- `DELETE /api/admin/questions/{id}` — Soft/Hard delete question
- `PUT /api/admin/hierarchy/toggle-publish` — (L0-L4) toggle visibility
- `PUT /api/admin/hierarchy/reorder` — Move items up/down

## Verification
- Run `mvn clean compile` — passed.
- Student login → No longer sees "Under Construction" topics (filtered by `isPublished`).
- Admin Question Bank → Successfully created, edited, and deleted questions.

---
**Sprint 19 is officially closed.**
