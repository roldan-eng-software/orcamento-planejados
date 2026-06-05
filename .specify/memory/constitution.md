<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> I. Forward Compatibility First
- PRINCIPLE_2_NAME -> II. Single Tech Stack Across All Versions
- PRINCIPLE_3_NAME -> III. Schema-First Development
- PRINCIPLE_4_NAME -> IV. API-Driven UI
- PRINCIPLE_5_NAME -> V. Multi-Role Authentication From Day One
- Added VI. Isolated Pricing Engine
- Added VII. Mobile-First Customer Experience
- Added VIII. Brazilian Market Compliance
- Added IX. Performance and Simplicity Budget
- Added X. Testing Strategy
Added sections:
- Product Scope and Version Boundaries
- Version Transition Rules
- Out of Scope for This Constitution
- Development Workflow and Quality Gates
Removed sections:
- Placeholder section SECTION_2_NAME
- Placeholder section SECTION_3_NAME
Templates requiring updates:
- updated .specify/templates/plan-template.md
- updated .specify/templates/spec-template.md
- updated .specify/templates/tasks-template.md
- checked .specify/templates/commands/*.md (directory not present)
- checked .specify/extensions/*/commands/*.md
- updated README.md
- checked AGENTS.md
Follow-up TODOs: none
-->
# OrcaFlex Constitution

## Core Principles

### I. Forward Compatibility First
Every data model, API contract, and UI component created for Version 1 MUST be
designed to extend into Versions 2 and 3 without breaking changes. Breaking
changes require explicit versioned migrations, documented rollback notes, and
approval through the amendment process. Silent rewrites or data loss are
forbidden because the platform must evolve from lead capture to automated
pricing and e-commerce without rebuilding its foundation.

### II. Single Tech Stack Across All Versions
The approved stack is Next.js App Router, TypeScript, Tailwind CSS, Supabase
(Postgres, Auth, and Storage), Prisma ORM, and Vercel hosting. Every feature
MUST use this stack unless the feature spec documents a concrete limitation and
the governance process approves the deviation before implementation. A single
stack keeps Version 1 simple while preserving the path to multi-tenant SaaS and
DIY e-commerce.

### III. Schema-First Development
Database schema changes MUST be defined in a Prisma migration before feature
code that depends on those fields is implemented. JSON blobs and other
schema-less escape hatches MUST NOT be used to avoid modeling required domain
data. The data model is the contract that protects quotations, pricing
configuration, tenants, orders, and future migrations.

### IV. API-Driven UI
All frontend reads and mutations MUST go through typed Next.js Server Actions or
Route Handlers. Client Components MUST NOT call the database directly or import
server-only persistence code. This boundary keeps authorization, validation,
auditing, and future public API behavior consistent across admin, customer, and
checkout flows.

### V. Multi-Role Authentication From Day One
Authentication and authorization MUST be built with role-based access control
from the first release. Version 1 may expose only the `admin` role, but the
model MUST support `customer`, `admin`, and `super_admin` roles for later
versions. Supabase Auth with JWT custom claims is the default role assignment
mechanism. Authorization checks MUST be enforced on the server for every admin,
tenant, pricing, order, and customer-data operation.

### VI. Isolated Pricing Engine
Pricing calculation logic MUST live in `/lib/pricing/` and MUST NOT import UI
components or route-specific code. The module MUST be callable from Server
Actions, Route Handlers, admin preview tools, and future checkout logic. Version
3 MUST reuse the Version 2 pricing engine; parallel pricing logic is forbidden
because it would create inconsistent quotes, carts, and production orders.

### VII. Mobile-First Customer Experience
Customer-facing pages MUST be designed and verified mobile-first. The quotation
form, result pages, product customization, cart, and checkout flows MUST be
usable on smartphones before desktop enhancements are added. Admin dashboards
may be desktop-first, but they MUST remain usable on tablet-sized viewports.
This matches the expected behavior of customers who request quotes from a
mobile messaging context.

### VIII. Brazilian Market Compliance
All user-facing copy MUST default to Brazilian Portuguese. Currency MUST be BRL
formatted as `R$ 1.234,56`, dates MUST be displayed as `DD/MM/YYYY`, and phone
numbers MUST support `(DDD) 9XXXX-XXXX`. Features that collect personal data
MUST follow LGPD minimization: collect only necessary data, show consent on the
form, provide a privacy policy from Version 1, and support deletion requests.
Payment features in Version 3 MUST support Brazilian payment expectations,
including Pix and credit card through an approved provider.

### IX. Performance and Simplicity Budget
Version 1 MUST remain deployable as a single Next.js application on Vercel with
a lightweight managed Postgres database. Customer-facing Version 1 pages MUST
target Lighthouse Performance >= 90 and Accessibility >= 95. New npm
dependencies MUST be justified in the plan when the platform stack or standard
APIs are insufficient. Images MUST use Next.js image optimization. Complexity
that does not serve the active product version or forward compatibility MUST be
removed or deferred.

### X. Testing Strategy
Tests are mandatory where risk is constitutional. Unit tests are REQUIRED for
form validation logic, utility functions, and all pricing engine code in Version
2 and later. Integration tests are REQUIRED for Server Actions and Route
Handlers that read, mutate, price, authenticate, or authorize data. E2E tests
are REQUIRED for the quote submission flow in all versions and for checkout in
Version 3. Code in `/lib/pricing/` MUST NOT be merged without at least 80% unit
test coverage for that module.

## Product Scope and Version Boundaries

OrcaFlex is a planned furniture quotation platform for custom kitchens,
wardrobes, offices, closets, and later DIY flat-pack furniture kits. The product
MUST evolve through three scoped versions:

- Version 1: Lead Capture and Manual Quotation. The system replaces informal
  WhatsApp or phone intake with a public landing page, structured quotation
  request form, simple admin authentication, and an admin dashboard for manual
  review, status tracking, replies, and internal notes. Automated pricing is
  out of scope for Version 1.
- Version 2: Automated Quotation MicroSaaS. The system adds an admin-managed
  pricing configuration module, instant estimated quotes, itemized customer
  result pages, and multi-tenant-ready architecture. Version 1 data MUST migrate
  cleanly into Version 2 with no data loss.
- Version 3: DIY Flat-Pack E-Commerce. The system adds product catalog,
  dimension customization, cart, checkout, payment, order management, customer
  tracking, PDFs, hardware lists, and production output. It MUST reuse the
  Version 2 pricing engine.

Feature specs MUST declare which product version they target. A feature MUST
NOT introduce behavior from a later version unless its spec explicitly marks the
work as a version transition or enabling foundation.

## Version Transition Rules

The Version 1 to Version 2 transition is triggered when the pricing
configuration module is first deployed to production. No undocumented hybrid
state between manual-only and automated pricing is allowed.

The Version 2 to Version 3 transition is triggered when the e-commerce cart is
deployed. The Version 2 quote form may continue as a custom-order path beside
the Version 3 product catalog.

Each transition MUST have a migration checklist spec before implementation
begins, such as `migration-v1-to-v2` or `migration-v2-to-v3`. Transition specs
MUST cover data migration, rollback, user-facing behavior, authorization,
pricing consistency, and operational validation.

## Out of Scope for This Constitution

This constitution does not govern visual design choices such as color palettes,
typography, spacing tokens, or illustration style. Those decisions belong in
design specs.

This constitution does not govern content strategy or copywriting beyond the
Brazilian Portuguese and compliance requirements above. Detailed content belongs
in content specs.

This constitution does not select third-party SaaS products within the approved
stack. Provider choices and tradeoffs belong in the technical plan, subject to
the stack and Brazilian market requirements.

## Development Workflow and Quality Gates

Plans MUST pass the Constitution Check before research begins and again after
design. The check MUST explicitly cover forward compatibility, approved stack,
Prisma migrations, API boundaries, RBAC, pricing isolation, mobile-first UX,
Brazilian market compliance, performance budget, and required tests.

Specs MUST include product version scope, user journeys, measurable outcomes,
data entities when applicable, LGPD-sensitive data notes, and assumptions that
affect later versions. Plans MUST document any constitutional deviation in the
Complexity Tracking table with the simpler alternative that was rejected.

Tasks MUST be grouped by independently testable user story and MUST include
foundation tasks for schema, auth, API boundaries, validation, observability,
and test coverage when those areas apply. Tests required by this constitution
MUST be generated before implementation tasks for the related behavior.

## Governance

This constitution supersedes conflicting project practices, templates, specs,
plans, and task lists. Amendments require a written rationale, a version bump,
an impact report, and updates to affected Spec Kit templates or runtime
guidance. Amendments that remove or redefine principles require a MAJOR version
bump. Amendments that add principles, sections, or materially expand governance
require a MINOR version bump. Clarifications and wording-only changes require a
PATCH version bump.

Every feature review MUST verify compliance with the active constitution. Any
approved deviation MUST be documented in the plan and tied to a specific
constraint, migration, or product-version need. Unresolved constitutional
violations block implementation.

**Version**: 1.0.0 | **Ratified**: 2026-06-05 | **Last Amended**: 2026-06-05
