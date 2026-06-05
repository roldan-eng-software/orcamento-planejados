# Tasks: OrcaFlex V1

**Input**: Design documents from `/specs/001-orcaflex-v1/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by the constitution and feature specification for validation, Server Actions, admin authorization, quote submission, deletion anonymization, throttling, receipt failures, stale status updates, and key E2E flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the single Next.js application structure, tooling, and environment contracts.

- [X] T001 Create Next.js app package metadata and scripts in package.json
- [X] T002 Configure TypeScript compiler options and path aliases in tsconfig.json
- [X] T003 Configure Next.js runtime and image settings in next.config.ts
- [X] T004 Configure Tailwind CSS entry styles in app/globals.css
- [X] T005 Create root application layout in app/layout.tsx
- [X] T006 Create environment variable template in .env.example
- [X] T007 [P] Configure linting rules in eslint.config.mjs
- [X] T008 [P] Configure test runner in vitest.config.ts
- [X] T009 [P] Configure Playwright project in playwright.config.ts
- [X] T010 [P] Create shared test setup in tests/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish schema, auth, validation, storage, formatting, and shared UI foundations required before any user story implementation.

**Critical**: No user story work can begin until this phase is complete.

- [X] T011 Create Prisma schema datasource, generator, enums, and models in prisma/schema.prisma
- [X] T012 Create initial Prisma migration for OrcaFlex V1 data model in prisma/migrations/001_orcaflex_v1/migration.sql
- [X] T013 [P] Create Prisma client singleton in lib/db/prisma.ts
- [X] T014 [P] Create Supabase browser/server client helpers in lib/supabase/client.ts and lib/supabase/server.ts
- [X] T015 [P] Create role constants and authorization helpers in lib/auth/roles.ts
- [X] T016 Create admin session verification helper in lib/auth/session.ts
- [X] T017 Create admin route protection middleware in middleware.ts
- [X] T018 [P] Create formatting utilities for BRL, DD/MM/YYYY, and Brazilian WhatsApp numbers in lib/formatting/locale.ts
- [X] T019 [P] Create quotation form Zod schemas and exported types in lib/validation/quotation.ts
- [X] T020 [P] Create admin request Zod schemas and exported types in lib/validation/admin-request.ts
- [X] T021 [P] Create storage validation helpers for jpg/png/webp and 5 MB limits in lib/storage/photo-validation.ts
- [X] T022 Create Supabase Storage adapter for quotation photos in lib/storage/quotation-photos.ts
- [X] T023 Create receipt email adapter contract in lib/email/quotation-receipt.ts
- [X] T024 Create protocol generation utility with uniqueness support in lib/quotation/protocol.ts
- [X] T025 Create same-contact 10-minute throttling helper in lib/quotation/throttle.ts
- [X] T026 Create personal-data anonymization utilities in lib/privacy/anonymize.ts
- [X] T027 [P] Create shared form components in components/shared/form-field.tsx
- [X] T028 [P] Create shared status badge component in components/shared/status-badge.tsx
- [X] T029 [P] Create shared loading and empty-state components in components/shared/feedback.tsx
- [X] T030 Create Supabase Edge Function scaffold for receipt email in supabase/functions/send-quotation-receipt/index.ts

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Customer submits quotation request (Priority: P1) MVP

**Goal**: Anonymous customers can read guidance, submit a valid quotation request with optional photos and consent, and receive an on-page protocol confirmation.

**Independent Test**: Submit a complete request from `/` and verify the form is replaced by a confirmation card with `ORC-YYYYMMDD-XXXX`; invalid data shows field-level errors and creates no request.

### Tests for User Story 1

- [X] T031 [P] [US1] Add unit tests for quotation validation schema in tests/unit/quotation-validation.test.ts
- [X] T032 [P] [US1] Add unit tests for protocol generation in tests/unit/protocol.test.ts
- [X] T033 [P] [US1] Add unit tests for repeat-submission throttling in tests/unit/throttle.test.ts
- [X] T034 [P] [US1] Add integration tests for submitQuotationRequest success and validation errors in tests/integration/submit-quotation.test.ts
- [X] T035 [P] [US1] Add integration tests for photo upload validation and storage failure handling in tests/integration/quotation-photos.test.ts
- [X] T036 [P] [US1] Add integration tests for receipt status persistence on email failure in tests/integration/receipt-status.test.ts
- [X] T037 [P] [US1] Add Playwright E2E test for public quote submission in tests/e2e/quote-submission.spec.ts
- [X] T038 [P] [US1] Add Playwright E2E test for invalid public form feedback in tests/e2e/quote-validation.spec.ts

### Implementation for User Story 1

- [X] T039 [US1] Implement submitQuotationRequest Server Action in app/actions/quotation.ts
- [X] T040 [US1] Implement request creation repository functions in lib/quotation/requests.ts
- [X] T041 [US1] Implement photo upload orchestration in lib/storage/quotation-photos.ts
- [X] T042 [US1] Implement receipt email invocation and failure capture in lib/email/quotation-receipt.ts
- [X] T043 [US1] Implement public landing content section in components/quotation/landing-guidance.tsx
- [X] T044 [US1] Implement quotation request form component in components/quotation/quotation-form.tsx
- [X] T045 [US1] Implement confirmation card component in components/quotation/confirmation-card.tsx
- [X] T046 [US1] Compose public landing page with guidance and embedded form in app/(public)/page.tsx
- [X] T047 [US1] Implement file input preview and limit messaging in components/quotation/photo-upload-field.tsx
- [X] T048 [US1] Wire LGPD consent copy and privacy link into components/quotation/quotation-form.tsx
- [X] T049 [US1] Implement repeat-submission retry message in app/actions/quotation.ts
- [X] T050 [US1] Seed sample public form option constants in lib/quotation/options.ts

**Checkpoint**: US1 is fully functional and testable independently as the MVP.

---

## Phase 4: User Story 2 - Admin reviews and manages requests (Priority: P2)

**Goal**: The admin can sign in, view and filter requests, open details, update status, add private notes, see failed receipt status, and handle privacy anonymization.

**Independent Test**: Sign in as admin, find a submitted request, update its status, add a note, verify stale status protection, and anonymize personal data while retaining non-personal history.

### Tests for User Story 2

- [X] T051 [P] [US2] Add integration tests for admin sign-in authorization in tests/integration/admin-auth.test.ts
- [X] T052 [P] [US2] Add integration tests for admin request list filters and pagination in tests/integration/admin-request-list.test.ts
- [X] T053 [P] [US2] Add integration tests for stale status update rejection in tests/integration/status-concurrency.test.ts
- [X] T054 [P] [US2] Add integration tests for internal notes append-only behavior in tests/integration/internal-notes.test.ts
- [X] T055 [P] [US2] Add integration tests for personal data anonymization in tests/integration/anonymize-request.test.ts
- [X] T056 [P] [US2] Add Playwright E2E test for admin review flow in tests/e2e/admin-review.spec.ts
- [X] T057 [P] [US2] Add Playwright E2E test for stale status refresh prompt in tests/e2e/admin-status-conflict.spec.ts

### Implementation for User Story 2

- [X] T058 [US2] Implement signInAdmin Server Action in app/actions/admin-auth.ts
- [X] T059 [US2] Implement admin login page in app/admin/login/page.tsx
- [X] T060 [US2] Implement admin request query functions with filters and pagination in lib/admin/request-queries.ts
- [X] T061 [US2] Implement updateRequestStatus Server Action with concurrency marker in app/actions/admin-requests.ts
- [X] T062 [US2] Implement addInternalNote Server Action in app/actions/admin-requests.ts
- [X] T063 [US2] Implement anonymizeQuotationPersonalData Server Action in app/actions/admin-requests.ts
- [X] T064 [US2] Implement admin request list table/card component in components/admin/request-list.tsx
- [X] T065 [US2] Implement admin request filters component in components/admin/request-filters.tsx
- [X] T066 [US2] Implement admin request list route in app/admin/requests/page.tsx
- [X] T067 [US2] Implement admin request detail layout in app/admin/requests/[id]/page.tsx
- [X] T068 [US2] Implement request detail sections in components/admin/request-detail.tsx
- [X] T069 [US2] Implement internal notes panel in components/admin/internal-notes.tsx
- [X] T070 [US2] Implement privacy deletion panel in components/admin/privacy-anonymization.tsx
- [X] T071 [US2] Implement receipt failure indicator in components/admin/receipt-status.tsx

**Checkpoint**: US2 is functional independently after US1 provides request data.

---

## Phase 5: User Story 3 - Admin replies through customer channel (Priority: P3)

**Goal**: The admin can prepare email and WhatsApp replies from a request detail using customer contact data and protocol-aware message templates.

**Independent Test**: Open a request detail and verify email and WhatsApp actions produce pre-filled messages with the correct recipient and protocol.

### Tests for User Story 3

- [X] T072 [P] [US3] Add unit tests for reply template generation in tests/unit/reply-templates.test.ts
- [X] T073 [P] [US3] Add integration tests for reply action data derivation in tests/integration/reply-actions.test.ts
- [X] T074 [P] [US3] Add Playwright E2E test for admin reply buttons in tests/e2e/admin-reply-actions.spec.ts

### Implementation for User Story 3

- [X] T075 [US3] Implement email and WhatsApp reply template helpers in lib/admin/reply-templates.ts
- [X] T076 [US3] Implement reply action derivation in lib/admin/reply-actions.ts
- [X] T077 [US3] Implement reply actions component in components/admin/reply-actions.tsx
- [X] T078 [US3] Integrate reply actions into request detail page in app/admin/requests/[id]/page.tsx
- [X] T079 [US3] Mark preferred contact channel in reply UI in components/admin/reply-actions.tsx

**Checkpoint**: US3 works from request detail without changing request status automatically.

---

## Phase 6: User Story 4 - Visitor accesses required static pages (Priority: P4)

**Goal**: Visitors can access LGPD-oriented privacy content and workshop contact information from static routes.

**Independent Test**: Open `/privacidade` and `/contato` and verify both routes load Brazilian Portuguese content with required privacy/contact details.

### Tests for User Story 4

- [X] T080 [P] [US4] Add Playwright E2E test for privacy page content in tests/e2e/privacy-page.spec.ts
- [X] T081 [P] [US4] Add Playwright E2E test for contact page content in tests/e2e/contact-page.spec.ts

### Implementation for User Story 4

- [X] T082 [US4] Implement privacy page content in app/(public)/privacidade/page.tsx
- [X] T083 [US4] Implement contact page content in app/(public)/contato/page.tsx
- [X] T084 [US4] Create static content constants in lib/content/static-pages.ts
- [X] T085 [US4] Add privacy and contact navigation links in app/layout.tsx
- [X] T086 [US4] Add privacy policy link from quotation form in components/quotation/quotation-form.tsx
- [X] T087 [US4] Add optional map placeholder section in app/(public)/contato/page.tsx

**Checkpoint**: US4 provides launch-required compliance and contact routes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate launch readiness across stories and clean up shared documentation and quality gates.

- [X] T088 [P] Update README setup and feature overview in README.md
- [X] T089 [P] Document environment variables and deployment notes in .env.example
- [X] T090 [P] Add quickstart validation notes to specs/001-orcaflex-v1/quickstart.md
- [X] T091 Run unit and integration test suite and record fixes in tests/
- [X] T092 Run Playwright E2E suite and record fixes in tests/e2e/
- [X] T093 Run Lighthouse check for public pages and record results in specs/001-orcaflex-v1/lighthouse-notes.md
- [X] T094 Verify Constitution Check coverage against specs/001-orcaflex-v1/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **US1 Customer submission (Phase 3)**: Depends on Foundational. This is the MVP.
- **US2 Admin management (Phase 4)**: Depends on Foundational and needs at least one request from US1 for end-to-end validation.
- **US3 Reply actions (Phase 5)**: Depends on US2 request detail.
- **US4 Static pages (Phase 6)**: Depends on Setup and can run after Foundational; privacy link integration touches US1 form.
- **Polish (Phase 7)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent MVP after Foundation.
- **US2 (P2)**: Operationally depends on request data from US1 but can be developed with seeded data after Foundation.
- **US3 (P3)**: Depends on US2 detail page and request contact data.
- **US4 (P4)**: Mostly independent; one task integrates the privacy link into the US1 form.

### Within Each User Story

- Tests first.
- Models/schema and shared services before UI pages.
- Server Actions before components that call them.
- Story complete before moving to lower-priority flows unless working in parallel on independent files.

---

## Parallel Opportunities

- Setup tasks T007-T010 can run in parallel after T001-T006 are underway.
- Foundational helpers T013-T015 and T018-T021 can run in parallel after T011.
- US1 test tasks T031-T038 can run in parallel.
- US2 test tasks T051-T057 can run in parallel.
- US3 test tasks T072-T074 can run in parallel.
- US4 test tasks T080-T081 can run in parallel.
- UI components within a story can run in parallel once related Server Actions and data contracts are stable.

---

## Parallel Example: User Story 1

```bash
# Parallel test tasks:
Task: "T031 [P] [US1] Add unit tests for quotation validation schema in tests/unit/quotation-validation.test.ts"
Task: "T032 [P] [US1] Add unit tests for protocol generation in tests/unit/protocol.test.ts"
Task: "T033 [P] [US1] Add unit tests for repeat-submission throttling in tests/unit/throttle.test.ts"
Task: "T037 [P] [US1] Add Playwright E2E test for public quote submission in tests/e2e/quote-submission.spec.ts"

# Parallel UI tasks after Server Action contract is stable:
Task: "T043 [US1] Implement public landing content section in components/quotation/landing-guidance.tsx"
Task: "T045 [US1] Implement confirmation card component in components/quotation/confirmation-card.tsx"
Task: "T047 [US1] Implement file input preview and limit messaging in components/quotation/photo-upload-field.tsx"
```

## Parallel Example: User Story 2

```bash
# Parallel test tasks:
Task: "T051 [P] [US2] Add integration tests for admin sign-in authorization in tests/integration/admin-auth.test.ts"
Task: "T052 [P] [US2] Add integration tests for admin request list filters and pagination in tests/integration/admin-request-list.test.ts"
Task: "T053 [P] [US2] Add integration tests for stale status update rejection in tests/integration/status-concurrency.test.ts"
Task: "T055 [P] [US2] Add integration tests for personal data anonymization in tests/integration/anonymize-request.test.ts"

# Parallel UI tasks after query/action contracts are stable:
Task: "T064 [US2] Implement admin request list table/card component in components/admin/request-list.tsx"
Task: "T065 [US2] Implement admin request filters component in components/admin/request-filters.tsx"
Task: "T069 [US2] Implement internal notes panel in components/admin/internal-notes.tsx"
Task: "T070 [US2] Implement privacy deletion panel in components/admin/privacy-anonymization.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T072 [P] [US3] Add unit tests for reply template generation in tests/unit/reply-templates.test.ts"
Task: "T073 [P] [US3] Add integration tests for reply action data derivation in tests/integration/reply-actions.test.ts"
Task: "T075 [US3] Implement email and WhatsApp reply template helpers in lib/admin/reply-templates.ts"
```

## Parallel Example: User Story 4

```bash
Task: "T080 [P] [US4] Add Playwright E2E test for privacy page content in tests/e2e/privacy-page.spec.ts"
Task: "T081 [P] [US4] Add Playwright E2E test for contact page content in tests/e2e/contact-page.spec.ts"
Task: "T084 [US4] Create static content constants in lib/content/static-pages.ts"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: Customer submits quotation request.
4. Validate `/` with unit, integration, and E2E tests.
5. Demo lead capture with protocol confirmation.

### Incremental Delivery

1. Foundation ready.
2. Add US1 customer submission and deploy/demo MVP.
3. Add US2 admin management and privacy operations.
4. Add US3 reply actions.
5. Add US4 static pages and final launch compliance.
6. Run polish checks and quickstart validation.

### Team Parallel Strategy

1. One developer owns schema/auth/foundation.
2. One developer writes US1 tests and public form UI.
3. One developer prepares admin query/action tests for US2.
4. Once foundation is merged, story work proceeds independently by file area.

---

## Notes

- All tasks use exact file paths and the required checkbox format.
- Tests required by the constitution are intentionally placed before implementation tasks.
- Keep V1 manual-only; do not add automated pricing, customer accounts, checkout, multi-tenant admin, or external state management libraries.
- Use `specs/001-orcaflex-v1/quickstart.md` as the final end-to-end validation guide.
