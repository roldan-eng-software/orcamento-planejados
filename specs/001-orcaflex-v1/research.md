# Research: OrcaFlex V1

## Decision: Use Next.js App Router Server Actions for customer submission and admin mutations

**Rationale**: The constitution requires typed Server Actions or Route Handlers
for data access, and the V1 spec explicitly requires the quote form to use a
Server Action. Current Next.js documentation supports Server Actions for form
mutations with validation and cache revalidation, and file inputs can be read
from `FormData` inside a Server Action. This keeps the public form in one page
and avoids adding a separate REST endpoint for the main lead-capture flow.

**Alternatives considered**:

- REST endpoint for the quote form: rejected because the spec forbids a
  separate REST endpoint for this form and it would add avoidable surface area.
- Client-side database or storage access: rejected by the constitution's API
  boundary and server-side authorization requirements.

## Decision: Use Supabase Auth for admin login and server-side authorization

**Rationale**: Supabase is the approved auth provider in the constitution.
Next.js guidance requires protected handlers to verify authentication and role
authorization server-side. V1 will expose only the `admin` role while preserving
the role model for `customer` and `super_admin`.

**Alternatives considered**:

- Hardcoded admin password: rejected because it would not preserve the V2/V3
  role path or provide managed sessions.
- Customer accounts in V1: rejected because they are explicitly out of scope.

## Decision: Use Supabase Storage for optional project photos

**Rationale**: The spec requires up to 3 jpg/png/webp photos of up to 5 MB each.
Supabase Storage is in the approved stack and supports Next.js image rendering
patterns. Storing photo metadata in Postgres while storing image objects in
Storage keeps request records queryable and supports deletion/anonymization.

**Alternatives considered**:

- Store images in the database: rejected because it bloats relational records
  and complicates image delivery.
- Skip uploads in V1: rejected because optional photos are in the feature scope.

## Decision: Use Prisma schema-first migrations for relational data

**Rationale**: The constitution requires Prisma migrations before feature code.
Prisma schema supports nullable fields for forward compatibility, relations for
requests/photos/notes, and a status version or last-updated marker to detect
stale status updates.

**Alternatives considered**:

- JSON-only request payloads: rejected as a schema-less escape hatch for domain
  data that must be filtered, searched, anonymized, and migrated.
- Ad hoc SQL without Prisma schema ownership: rejected by the schema-first
  governance rule.

## Decision: Model status changes with optimistic concurrency

**Rationale**: Clarification requires stale status updates to be detected and
blocked. A `statusVersion` or `statusUpdatedAt` marker on `QuotationRequest`
lets the status update action compare the submitted marker with the current
record and return a refresh-required result rather than silently overwriting.

**Alternatives considered**:

- Pessimistic locks: rejected as too heavy for one-admin V1 usage and awkward
  for serverless request lifecycles.
- Last-write-wins: rejected by clarification because silent overwrites are not
  allowed.

## Decision: Track automatic receipt delivery status on the request

**Rationale**: Clarification requires failed auto-replies to appear in the admin
list and detail. Store status, attempted timestamp, and optional failure reason
on `QuotationRequest` or a related notification record. V1 can start with fields
on the request and later extract a notification table if additional channels
grow in V2/V3.

**Alternatives considered**:

- Hide failures unless logs are inspected: rejected because admin recovery is a
  V1 operational need.
- Full notification system: deferred as unnecessary for V1.

## Decision: Anonymize deletion requests instead of deleting full records

**Rationale**: Clarification chooses LGPD anonymization: personal identifiers,
photos, and personal identifiers inside internal notes are anonymized while
non-personal project/status history remains for business reporting. This
preserves operational history and avoids silent loss of dashboard metrics.

**Alternatives considered**:

- Hard-delete all request data: rejected because it removes business history and
  notes that can be retained after anonymization.
- Manual flag only: rejected because it does not complete the deletion request.

## Decision: Block repeated same-contact submissions for 10 minutes

**Rationale**: Clarification requires repeated submissions from the same email
or WhatsApp within 10 minutes to be blocked with a clear retry message. The
submission action can check recent requests by normalized email/phone before
creating a new protocol.

**Alternatives considered**:

- Accept all valid submissions: rejected because it leaves accidental duplicate
  and spam bursts unbounded.
- Require accounts after first submission: rejected because V1 customers are
  anonymous.

## Decision: Keep V1 dependency footprint small

**Rationale**: The constitution forbids unnecessary complexity and the spec
forbids external state management libraries. React state, Server Components,
Server Actions, Zod, Prisma, Supabase, and the test stack are sufficient for V1.

**Alternatives considered**:

- Zustand/Redux: rejected explicitly by the spec.
- Separate backend service: rejected because V1 must remain a single deployable
  application.

## Decision: Implement the homepage service-scope notice as non-persisted client UI state

**Rationale**: The notice is a lead-qualification interaction that only needs
to appear in front of the homepage and close after the visitor clicks the
acknowledgement button. A small client component using React state is enough,
keeps V1 within the approved stack, and avoids storing acknowledgement data in
cookies, localStorage, or the database. This also avoids introducing personal
data collection or a new Server Action/API endpoint for a purely presentational
alert.

**Alternatives considered**:

- Persist acknowledgement in localStorage or cookies: rejected because the
  request only requires the alert to close after clicking and persistence would
  add tracking/state with no V1 operational need.
- Persist acknowledgement in the database: rejected because visitors are
  anonymous and the alert does not create a business record.
- Use a browser `alert()`: rejected because it is not stylable, provides poor
  accessibility/control, and cannot present the required content with the
  product's visual language.
