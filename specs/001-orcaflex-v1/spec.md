# Feature Specification: OrcaFlex V1

**Feature Branch**: `001-orcaflex-v1`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "Build OrcaFlex V1 - a lightweight web platform for a custom furniture workshop to receive, manage, and respond to quotation requests from customers."

## Product Version Scope *(mandatory)*

**Target Version**: V1 - Lead Capture and Manual Quotation

**Scope Boundary**: OrcaFlex V1 replaces unstructured WhatsApp and phone intake
with a public guidance page, quotation request form, admin dashboard, manual
reply actions, and static compliance/contact pages. Automated pricing,
customer accounts, multi-tenant operation, e-commerce, checkout, CNC file
generation, and native mobile apps are explicitly excluded except for
forward-compatible data fields and role structure needed by later versions.

## Clarifications

### Session 2026-06-05

- Q: When a customer requests data deletion, what should V1 do with the existing quotation request? → A: Anonymize personal data on deletion request, retain non-personal project/status history.
- Q: How should V1 expose failed customer auto-reply confirmations to the admin? → A: Store confirmation status and show failed confirmations in admin list/detail.
- Q: How should V1 handle concurrent admin changes to the same request status? → A: Detect stale status updates and ask admin to refresh before saving.
- Q: When a customer requests data deletion, how should V1 handle internal admin notes for that request? → A: Anonymize personal identifiers inside internal notes.
- Q: How should V1 handle repeated quotation submissions from the same customer contact in a short period? → A: Limit repeated submissions from same email or WhatsApp within 10 minutes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer submits quotation request (Priority: P1)

An anonymous customer visits the public page, understands what information is
needed for a planned furniture quote, fills in the embedded form, consents to
data use, and receives an on-screen confirmation with a protocol number.

**Why this priority**: This is the core lead-capture value of V1. Without a
structured request, the workshop owner still depends on fragmented messages and
phone calls.

**Independent Test**: A tester can submit a complete quotation request from the
public page and verify that the form is replaced by a confirmation card showing
a protocol number in the expected format.

**Acceptance Scenarios**:

1. **Given** a customer is on the public page, **When** they read the guidance
   and submit all required fields with consent, **Then** the request is saved
   and the same page shows a protocol number formatted as `ORC-YYYYMMDD-XXXX`.
2. **Given** a customer leaves a required field blank or enters invalid contact
   data, **When** they try to submit the form, **Then** the page shows clear
   field-level guidance and does not create a request.
3. **Given** a customer uploads photos within the allowed limits, **When** the
   request is submitted, **Then** the photos are associated with the request and
   are available to the admin.

---

### User Story 2 - Admin reviews and manages requests (Priority: P2)

The workshop owner signs in, opens the admin request list, filters and searches
submitted requests, opens a request detail, updates its status, and records
internal notes.

**Why this priority**: The workshop needs a reliable operational queue to
replace scattered conversations and track each opportunity through manual
quotation.

**Independent Test**: A tester can sign in as the admin, find a submitted
request, change its status, add a note, and verify the updated information is
retained when reopening the request.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor tries to access the admin area,
   **When** they navigate to an admin request page, **Then** they are sent to
   the admin sign-in page before any request data is shown.
2. **Given** the admin is signed in and requests exist, **When** they filter by
   status, date range, or furniture type, **Then** only matching requests are
   displayed with newest requests first by default.
3. **Given** the admin opens a request detail, **When** they change status and
   add an internal note, **Then** the status is updated and the note appears in
   chronological order without being visible to customers.

---

### User Story 3 - Admin replies through customer channel (Priority: P3)

The admin opens a request detail and uses contextual reply actions to start an
email or WhatsApp response that includes the protocol number and a prepared
message.

**Why this priority**: V1 intentionally keeps pricing manual, so the product
must make follow-up fast while preserving the customer's chosen contact
context.

**Independent Test**: A tester can open a request detail and verify that email
and WhatsApp actions prepare a reply addressed to the submitted contact data
with the protocol number in the subject or message.

**Acceptance Scenarios**:

1. **Given** a request includes an email address, **When** the admin chooses
   "Responder por e-mail", **Then** the default email client opens with the
   customer email, protocol number, and response template pre-filled.
2. **Given** a request includes a WhatsApp number, **When** the admin chooses
   "Responder no WhatsApp", **Then** a WhatsApp conversation opens in a new tab
   with a pre-filled message that includes the protocol number.
3. **Given** the customer selected one preferred contact channel, **When** the
   admin views reply actions, **Then** both available contact actions may still
   be shown while visually identifying the preferred channel.

---

### User Story 4 - Visitor accesses required static pages (Priority: P4)

A visitor can open the privacy policy and contact pages from the site to review
data-use terms and contact the workshop outside the quotation form.

**Why this priority**: V1 collects personal data and must provide basic trust,
LGPD transparency, and workshop contact information from launch.

**Independent Test**: A tester can navigate to the privacy and contact pages
and verify that each route loads useful static content.

**Acceptance Scenarios**:

1. **Given** a visitor wants to understand data usage, **When** they open the
   privacy page, **Then** they see LGPD-oriented information about quotation
   data collection, use, consent, and deletion requests.
2. **Given** a visitor wants direct contact information, **When** they open the
   contact page, **Then** they see the workshop address, phone, email, and a map
   area if available.

---

### User Story 5 - Visitor acknowledges service-scope notice (Priority: P1)

An anonymous visitor opens the public homepage and sees a floating alert before
interacting with the page. The alert clearly explains that the workshop only
serves new, custom, medium/high-standard planned furniture and lists the
categories of requests that are not accepted.

**Why this priority**: This qualifies leads before the customer spends time in
the form, reducing unsuitable requests for reforms, repairs, loose MDF pieces,
and installation services outside OrcaFlex V1 scope.

**Independent Test**: A tester opens `/`, verifies the alert is visible above
the homepage content with the required text, clicks "Entendo o que não pedir",
and verifies the alert closes while the homepage remains available.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** the page renders, **Then**
   a floating alert appears in front of the homepage before normal interaction.
2. **Given** the alert is visible, **When** the visitor reads it, **Then** it
   shows the exact service-scope copy in Brazilian Portuguese.
3. **Given** the alert is visible, **When** the visitor clicks "Entendo o que
   não pedir", **Then** the alert closes and the visitor can use the homepage
   and quotation form normally.

---

### User Story 6 - Customer requests technical 3D project and visit (Priority: P1)

An anonymous customer filling the quotation form can request a technical 3D
project. When they select this option, the form clearly warns that the 3D
project costs R$ 100,00 and that this amount may be used as a discount if the
customer closes the fabrication contract. After accepting/requesting the 3D
project, the customer can also request a technical visit.

**Why this priority**: This qualifies paid pre-project work before the workshop
spends design or travel time, while still capturing customers who want a more
detailed evaluation path.

**Independent Test**: A tester opens `/`, dismisses the service-scope alert,
checks that the technical visit field is disabled with explanatory tooltip
copy, selects the technical 3D project option, verifies the R$ 100,00 notice is
shown, and verifies the technical visit option becomes enabled.

**Acceptance Scenarios**:

1. **Given** a customer is filling the quotation form, **When** they have not
   selected the technical 3D project option, **Then** the technical visit
   option is disabled and explains on hover/focus that a technical visit is
   allowed only when hiring the 3D project.
2. **Given** a customer selects the technical 3D project option, **When** the
   option becomes active, **Then** the form shows a clear notice that the
   project costs R$ 100,00 and that this amount may become a discount in the
   fabrication contract.
3. **Given** a customer selected the technical 3D project option, **When** they
   choose technical visit and submit a valid request, **Then** the request saves
   both choices for admin review.

### Edge Cases

- A customer chooses "Outro" as furniture type; the system requires a free-text
  description of the furniture type before submission.
- A customer selects "Não sei / Quero sugestão" for finish; the request remains
  valid and is flagged as needing workshop recommendation.
- A customer uploads more than 3 images, an unsupported file type, or a file
  larger than 5 MB; the system rejects only the invalid upload attempt and
  explains the allowed limits.
- A customer enters dimensions as zero, negative values, or non-numeric text;
  the system blocks submission and asks for approximate measurements in
  centimeters.
- A customer submits with a duplicate email or phone outside the 10-minute
  repeat-submission window; the system creates a new request with a new
  protocol rather than merging records silently.
- A customer submits repeatedly with the same email or WhatsApp within 10
  minutes; the system blocks the repeat submission and explains when the
  customer can try again.
- An email confirmation cannot be sent; the customer still receives on-screen
  confirmation, the failed confirmation status is stored, and the admin can see
  the failure in both the request list and request detail.
- A customer requests deletion of personal data; the system anonymizes personal
  identifiers and photos while retaining non-personal project, status, consent,
  anonymized internal notes, and operational history for business reporting.
- The admin opens a request with missing or unavailable photo thumbnails; the
  detail page keeps all textual request data visible and marks the photo as
  unavailable.
- The request list contains more than 20 items; the admin can navigate pages
  without losing active filters.
- Two admin sessions attempt to change the same request status; the system
  detects stale status updates and asks the admin to refresh before saving,
  preventing silent overwrites.
- A visitor lands on the homepage using a small mobile viewport; the
  service-scope alert remains readable, keeps the acknowledgement button
  visible, and does not require horizontal scrolling.
- A customer tries to request technical visit without selecting technical 3D
  project; the UI keeps the visit option disabled and server-side validation
  rejects any manipulated submission that sends visit without 3D project.
- A customer selects technical 3D project and then deselects it; the technical
  visit option is cleared and disabled again.

### Compliance and Market Notes *(mandatory)*

- **Language/Locale**: All customer-facing copy defaults to Brazilian
  Portuguese. Currency is shown in BRL as `R$ 1.234,56`, dates as
  `DD/MM/YYYY`, and phone numbers in Brazilian WhatsApp format.
- **LGPD Data**: The feature collects name, email, WhatsApp phone, project
  details, optional budget range, optional photos, consent, and operational
  status/notes. The form requires explicit consent, links to the privacy policy,
  and supports deletion-request handling by anonymizing personal identifiers and
  photos, including identifiers found in internal notes, while retaining
  non-personal request history.
- **Mobile Customer Flow**: The public landing page and quotation form are
  designed for smartphone use first. The admin dashboard may prioritize larger
  screens but remains usable on tablet and readable on mobile through compact
  cards.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a single public scrollable page that
  explains the workshop service, lists the information needed for a quote, and
  embeds the quotation form below the guidance.
- **FR-002**: The quotation form MUST require full name, email, WhatsApp phone,
  preferred contact channel, furniture type, installation room, approximate
  width, approximate height, approximate depth, desired material or finish, and
  LGPD consent.
- **FR-003**: The quotation form MUST allow optional hardware preferences,
  additional description up to 1000 characters, budget range, and up to 3
  project photos in jpg, png, or webp format up to 5 MB each.
- **FR-004**: The system MUST support the furniture type options "Cozinha
  planejada", "Guarda-roupa", "Home office", "Closet", "Estante / Rack", and
  "Outro" with required free text when "Outro" is selected.
- **FR-005**: The system MUST support multiple desired material or finish
  selections, including "MDF branco", "MDF cor madeira", "MDF cor escura",
  "Laca", and "Não sei / Quero sugestão".
- **FR-006**: The system MUST validate all submitted customer data before
  creating a quotation request and show clear messages for invalid or missing
  values.
- **FR-007**: On successful submission, the system MUST create a unique protocol
  number formatted as `ORC-YYYYMMDD-XXXX`.
- **FR-008**: On successful submission, the system MUST replace the form with a
  confirmation card in the same page position and MUST NOT redirect the
  customer to another page.
- **FR-009**: On successful submission, the system MUST send the customer an
  automatic receipt message that includes the protocol number.
- **FR-010**: The system MUST provide an admin sign-in page using email and
  password and MUST protect admin pages from unauthenticated access.
- **FR-011**: The admin request list MUST show protocol number, customer name,
  furniture type, submission date, request status, and failed confirmation
  status when the automatic receipt message was not delivered.
- **FR-012**: The admin request list MUST support status, date range, and
  furniture type filters, search by customer name or protocol number, newest
  first sorting by default, and pagination of 20 requests per page.
- **FR-013**: Request statuses MUST include "Novo", "Em análise", "Orçado",
  and "Encerrado".
- **FR-014**: The admin request detail MUST show all submitted customer fields
  grouped consistently with the form sections.
- **FR-015**: The admin request detail MUST show uploaded photos as thumbnails
  and allow a larger view of each available image.
- **FR-016**: The admin MUST be able to change request status from the detail
  view.
- **FR-017**: The admin MUST be able to add internal notes with timestamps, and
  saved notes MUST remain read-only and hidden from customers.
- **FR-018**: The admin request detail MUST provide an email reply action that
  prepares a message with the customer's email, protocol number, and a response
  template.
- **FR-019**: The admin request detail MUST provide a WhatsApp reply action
  that prepares a message with the customer's phone number, protocol number,
  and a response template.
- **FR-020**: The system MUST provide a privacy policy page describing data
  collection, quotation use, consent, and deletion requests.
- **FR-021**: The system MUST provide a contact page with workshop address,
  phone, email, and an optional map area.
- **FR-022**: The system MUST preserve fields needed for later automated
  pricing, such as quoted value and pricing breakdown, while leaving automated
  pricing behavior unavailable in V1.
- **FR-023**: The system MUST document required environment configuration in an
  example environment file before deployment.
- **FR-024**: The system MUST support deletion requests by anonymizing customer
  name, email, WhatsApp phone, photos, free-text personal identifiers, and
  personal identifiers inside internal notes while retaining non-personal
  project details, protocol, status, consent, and operational history.
- **FR-025**: The system MUST store the automatic receipt confirmation status
  for each request and expose failed confirmations in both the admin request
  list and request detail.
- **FR-026**: The system MUST detect stale request status updates and require
  the admin to refresh before saving when another session changed the status
  first.
- **FR-027**: The system MUST limit repeated quotation submissions from the same
  email address or WhatsApp number within a 10-minute window and show a clear
  retry message.
- **FR-028**: The public homepage MUST show a floating alert in front of the
  homepage content when a visitor enters the site.
- **FR-029**: The service-scope alert MUST include the following copy:
  "Atuamos exclusivamente com móveis planejados novos, personalizados e de
  médio e alto padrão.

  Não realizamos reformas, consertos, manutenção de móveis antigos, cortes de
  chapa, peças avulsas de MDF, serviços em madeira maciça, uso de MDF de baixa
  qualidade ou instalação de móveis adquiridos pela internet."
- **FR-030**: The service-scope alert MUST provide a button labeled "Entendo o
  que não pedir" and MUST close the alert when the button is clicked.
- **FR-031**: The quotation form MUST include an optional "Projeto 3D técnico"
  choice.
- **FR-032**: When "Projeto 3D técnico" is selected, the form MUST show a clear
  notice that the technical 3D project costs `R$ 100,00` and that this amount
  may be used as a discount if the customer closes the fabrication contract.
- **FR-033**: The quotation form MUST include an optional technical visit choice
  that remains disabled until "Projeto 3D técnico" is selected.
- **FR-034**: When technical visit is disabled, the form MUST expose explanatory
  tooltip/help text on hover and focus stating that technical visit is allowed
  only when hiring the technical 3D project.
- **FR-035**: Server-side validation MUST reject any quotation submission that
  requests technical visit without also requesting the technical 3D project.

### Constitutional Requirements *(mandatory)*

- **CR-001**: System MUST preserve forward compatibility with later product versions.
- **CR-002**: System MUST use typed Server Actions or Route Handlers for frontend/backend data access.
- **CR-003**: System MUST define required database changes through Prisma migrations.
- **CR-004**: System MUST enforce role-based authorization server-side for protected operations.
- **CR-005**: System MUST keep pricing logic in `/lib/pricing/` when pricing behavior is in scope.
- **CR-006**: System MUST keep V1 manual-only; automated pricing, carts, checkout,
  customer accounts, and multi-tenant administration are out of scope.
- **CR-007**: System MUST support the `admin` role in V1 and preserve the model
  path for `customer` and `super_admin` roles in later versions.

### Key Entities *(include if feature involves data)*

- **QuotationRequest**: A customer quotation request, including protocol number,
  customer contact data, preferred contact channel, furniture details,
  dimensions, selected finishes, optional hardware preferences, optional budget,
  optional description, optional technical 3D project request, optional
  technical visit request, status, automatic receipt confirmation status,
  consent record, submission timestamp, status version or last-updated marker,
  and forward-compatible pricing fields. When deletion is requested, personal
  identifiers are anonymized while non-personal project and status history is
  retained.
- **QuotationPhoto**: An uploaded project image associated with one quotation
  request, including file metadata, storage reference, and availability status.
  Photos are treated as personal data and removed or anonymized on deletion
  request.
- **AdminUser**: The authenticated workshop user who can access protected admin
  pages and manage requests.
- **InternalNote**: A private admin note associated with one quotation request,
  including note text, author, and timestamp. Notes remain in the operational
  history after a deletion request, but personal identifiers inside note text
  are anonymized.
- **ReplyAction**: A prepared outbound contact action for email or WhatsApp,
  derived from the customer's contact data and request protocol.
- **StaticPageContent**: Privacy and contact content needed to support legal
  transparency and direct customer communication.
- **ServiceScopeNotice**: Non-persisted homepage UI content that describes what
  customers should and should not request before using the quotation form.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of test customers can submit a valid quotation
  request from a smartphone in under 5 minutes without assistance.
- **SC-002**: 100% of successful submissions show a protocol number immediately
  on the same page.
- **SC-003**: 100% of successful submissions are visible to the admin with all
  required customer and furniture fields.
- **SC-004**: The admin can find a known request by protocol number or customer
  name in under 30 seconds when at least 100 requests exist.
- **SC-005**: The admin can update status and save an internal note for a
  request in under 1 minute.
- **SC-006**: At least 95% of invalid form submissions in testing identify the
  exact field that needs correction.
- **SC-007**: The public page, quotation flow, privacy page, and contact page
  meet launch readiness for Brazilian Portuguese copy and LGPD consent review.
- **SC-008**: The request list remains usable with 20 visible items per page and
  retains filters while moving between pages.
- **SC-009**: A deletion-request test confirms personal identifiers and photos
  are no longer visible in customer fields, photos, or internal notes while
  non-personal request history remains available.
- **SC-010**: 100% of failed automatic receipt confirmations in testing are
  visible to the admin from the request list and request detail.
- **SC-011**: 100% of stale status-update attempts in concurrency testing are
  blocked with a refresh prompt instead of silently overwriting the latest
  status.
- **SC-012**: 100% of repeated submissions from the same email or WhatsApp
  within 10 minutes are blocked with a clear retry message in validation tests.
- **SC-013**: 100% of homepage entry tests show the service-scope alert before
  form interaction and allow it to close through the "Entendo o que não pedir"
  button without navigating away.
- **SC-014**: 100% of form interaction tests keep technical visit disabled until
  technical 3D project is selected, show the `R$ 100,00` notice when selected,
  and save both choices on valid submission.

## Assumptions

- V1 has one workshop owner/admin user, but the authorization model remains
  compatible with future customer and super-admin roles.
- Customers do not need accounts in V1 and receive follow-up through email or
  WhatsApp outside the product.
- Manual quotation preparation happens outside the system in V1; the dashboard
  tracks status and notes but does not calculate prices.
- The workshop will provide final privacy policy wording, contact details, and
  any map embed information before launch.
- If automatic receipt delivery fails, on-screen confirmation remains the
  customer's source of truth and the failure is visible for admin follow-up.
- Photo uploads are optional because customers may not have accurate project
  photos at the first contact.
