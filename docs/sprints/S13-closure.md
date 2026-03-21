# Sprint 13 Closure: Data Migration + PostgreSQL
Date: 2026-03-22

## What Was Built
- Data Foundation with PostgreSQL running via Docker (`docker-compose.yml`).
- Implemented `FileStorageService` for local file storage (PDFs/materials) configuring `app.storage.location`.
- Created an Admin Migration Status page to track loaded `MicroTopic` and `Question` counts.
- Modified `QuestionDataLoader` to dynamically load all `.xml` files from `classpath*:groupsguru/questions/**/*.xml` and ensure idempotency based on `QuestionCode`.
- Ensured migration scripts run cleanly on server restart.

## Files Created
- `C:\GroupsGuru\Lms\docker-compose.yml` — PostgreSQL database service.
- `C:\GroupsGuru\Lms\lms-backend\src\main\java\com\lms\common\service\FileStorageService.java` — Service for local file uploads and retrieval.
- `C:\GroupsGuru\Lms\lms-frontend\app\admin\migration\page.tsx` — Next.js admin page displaying migration counts.
- `C:\GroupsGuru\Lms\docs\sprints\S13-closure.md` — This file.

## Files Modified
- `C:\GroupsGuru\Lms\lms-backend\src\main\resources\application.yaml` — Switched DB config from H2 to PostgreSQL, added `app.storage.location`.
- `C:\GroupsGuru\Lms\lms-backend\src\main\java\com\lms\config\QuestionDataLoader.java` — Updated to scan all XMLs and load them idempotently.
- `C:\GroupsGuru\Lms\lms-backend\src\main\java\com\lms\admin\AdminController.java` — Added `/api/admin/migration/status` endpoint to fetch current DB counts.
- `C:\GroupsGuru\Lms\lms-backend\src\main\java\com\lms\registry\MicroTopicRepository.java` — Added `countByIsDeletedFalse()` to support the admin controller.

## DB Schema State
- Tables: Auto-generated/updated by Hibernate onto PostgreSQL (`ddl-auto: update`).
- Persistent storage volume: `lms-postgres-data`.

## API Endpoints Added
- `GET /api/admin/migration/status` — Returns a JSON map of microTopics and questions counts.

## Frontend Pages Added
- `app/admin/migration/page.tsx` — Accessible at `/admin/migration`.

## Mobile Screens Added
- None (No mobile changes planned for this sprint).

## How to Verify
1. Run `cd C:\GroupsGuru\Lms` and `docker-compose up -d`.
2. Start the Spring Boot backend (`mvnw spring-boot:run` or via IDE).
3. The loaders will trigger. Watch the console logs.
4. Start the Frontend (`npm run dev`).
5. Open `http://localhost:3000/admin/migration` and verify that Micro Topics == 1,021 and Questions > 0 (based on available XML files).
6. Restart the backend to verify that data persists and no duplications occur.

## Known Issues
- None immediately related to migration.

## Next Sprint Prerequisites
- S14 will use this persistent PostgreSQL DB. The next sprint introduces the `Commission` L0 entity and rearranges the hierarchy.
