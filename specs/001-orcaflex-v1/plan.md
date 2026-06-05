# Implementation Plan: OrcaFlex V1

**Branch**: `001-orcaflex-v1` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-orcaflex-v1/spec.md`

## Summary

Build OrcaFlex V1 as a single deployable web application for planned furniture
lead capture and manual quotation management. The public page guides anonymous
customers through a structured quotation form, creates a protocol, stores
optional photos, and attempts an automatic receipt. The protected admin area
lets one workshop owner review, filter, update, annotate, and manually reply to
requests while preserving forward-compatible data for later automated pricing
and e-commerce versions. The public homepage also shows a floating
service-scope alert before interaction so visitors acknowledge that the workshop
only accepts new, custom, medium/high-standard planned furniture requests and
does not accept reforms, repairs, loose MDF pieces, low-quality MDF, solid-wood
services, or internet-purchased furniture installation. The public quotation
form also lets customers request a paid technical 3D project and, only after
that option is selected, request a technical visit.

## Technical Context

**Language/Version**: TypeScript with Next.js 15 App Router

**Primary Dependencies**: Next.js, React, Tailwind CSS, Supabase Auth/Storage,
Prisma ORM, Zod, Nodemailer SMTP, Playwright/Vitest-compatible
test stack

**Storage**: Supabase Postgres through Prisma for relational data; Supabase
Storage for optional quotation photos; Supabase Auth for admin identity

**Testing**: Unit tests for validation and utilities; integration tests for
Server Actions, admin authorization, storage/email failure handling, deletion
anonymization, throttling, technical 3D/visit gating, and stale status updates;
Playwright E2E for quote submission and admin review flows

**Target Platform**: Vercel production and preview deployments; Supabase managed
project for database, auth, storage, and email function runtime

**Project Type**: Single Next.js full-stack web application

**Performance Goals**: V1 public pages target Lighthouse Performance >= 90 and
Accessibility >= 95; customer submission confirmation appears immediately after
successful processing; admin can find a known request in under 30 seconds with
100 stored requests

**Constraints**: Manual quotation only in V1; no customer accounts, automated
pricing, multi-tenant admin, checkout, CNC output, native mobile app, Redux, or
Zustand; customer form submission uses a Server Action, not a separate REST
endpoint; database changes begin with Prisma migrations; homepage
service-scope notice is non-persisted UI state and does not introduce cookies,
localStorage, database tables, or new API endpoints; the technical 3D project
fee is a fixed service-fee disclosure, not automated furniture pricing

**Scale/Scope**: One workshop/admin for V1, anonymous customer submissions,
request list paginated at 20 items per page, max 3 images per request, max
5 MB per image, repeated same-contact submissions blocked for 10 minutes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Product Version Scope**: PASS. The spec targets V1 lead capture and manual
  quotation and explicitly excludes V2/V3 behaviors.
- **Forward Compatibility**: PASS. Data model includes nullable pricing fields,
  role path for `customer` and `super_admin`, consent history, and status
  versioning for later transitions.
- **Approved Stack**: PASS. The plan uses Next.js App Router, TypeScript,
  Tailwind CSS, Supabase, Prisma ORM, and Vercel.
- **Schema First**: PASS. `data-model.md` defines entities and fields to drive
  Prisma migrations before feature code.
- **API Boundary**: PASS. Customer submission and admin mutations are modeled as
  typed Server Actions; any Route Handlers are limited to authenticated support
  interfaces such as protected image access when needed.
- **RBAC**: PASS. V1 uses `admin` and preserves role model for `customer` and
  `super_admin`; admin operations require server-side authorization.
- **Pricing Isolation**: PASS. No pricing behavior is implemented in V1; pricing
  fields are nullable forward-compatible fields only. The R$ 100,00 3D project
  amount is a fixed service-fee notice stored as request metadata and does not
  calculate furniture price.
- **Mobile and Market Fit**: PASS. Customer flow is mobile-first and follows
  Brazilian Portuguese, BRL, `DD/MM/YYYY`, Brazilian phone, and LGPD rules.
- **Lead Qualification UX**: PASS. The homepage notice uses Brazilian
  Portuguese copy, appears before form interaction, and closes with an explicit
  acknowledgement button without collecting personal data.
- **Paid Pre-Project UX**: PASS. The technical 3D project option uses Brazilian
  Portuguese currency copy, gates technical visit, and keeps the customer flow
  mobile-first.
- **Performance and Simplicity**: PASS. Single Next.js app, minimal dependency
  set, optimized image handling, and V1 Lighthouse targets are preserved.
- **Testing Gate**: PASS. Required unit, integration, and E2E coverage is called
  out for validation, Server Actions, admin auth, quote submission, deletion,
  throttling, confirmation failure, stale status updates, the homepage
  service-scope notice, and technical 3D/visit gating.

**Post-Design Re-check**: PASS. Phase 1 artifacts preserve all gates; the
service-scope notice adds only client-side UI state, and the technical 3D/visit
fields add schema-first request metadata with Server Action validation. No
constitutional deviations require Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/001-orcaflex-v1/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── server-actions.md
│   └── ui-flows.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
app/
├── (public)/
│   ├── page.tsx
│   ├── privacidade/page.tsx
│   └── contato/page.tsx
├── admin/
│   ├── login/page.tsx
│   └── requests/
│       ├── page.tsx
│       └── [id]/page.tsx
├── actions/
│   ├── quotation.ts
│   └── admin-requests.ts
└── middleware.ts

components/
├── quotation/
├── admin/
└── shared/

lib/
├── auth/
├── db/
├── email/
├── formatting/
├── privacy/
├── storage/
└── validation/

prisma/
└── schema.prisma

supabase/
└── functions/
    └── send-quotation-receipt/

tests/
├── e2e/
├── integration/
└── unit/
```

**Structure Decision**: Use one full-stack Next.js application at the repository
root. The `app/actions/` boundary keeps mutations server-only, `lib/` contains
domain and infrastructure helpers, and `prisma/schema.prisma` is the source for
database migrations. This matches the V1 simplicity budget and keeps V2/V3
growth paths open without splitting frontend/backend projects.

## Complexity Tracking

No constitutional violations. No complexity exceptions are required.
