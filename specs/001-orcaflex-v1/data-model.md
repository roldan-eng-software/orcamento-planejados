# Data Model: OrcaFlex V1

## QuotationRequest

Represents one customer quotation request and is the primary admin work item.

### Fields

- `id`: unique internal identifier
- `protocol`: unique customer-facing protocol, format `ORC-YYYYMMDD-XXXX`
- `customerName`: required before anonymization
- `customerEmail`: required before anonymization; normalized for search and
  repeat-submission checks
- `customerWhatsapp`: required before anonymization; normalized Brazilian phone
  number for search and repeat-submission checks
- `preferredContactChannel`: enum `EMAIL` or `WHATSAPP`
- `furnitureType`: enum `COZINHA_PLANEJADA`, `GUARDA_ROUPA`, `HOME_OFFICE`,
  `CLOSET`, `ESTANTE_RACK`, `OUTRO`
- `otherFurnitureType`: required when `furnitureType` is `OUTRO`
- `installationRoom`: required free text
- `approxWidthCm`: required positive number
- `approxHeightCm`: required positive number
- `approxDepthCm`: required positive number
- `desiredFinishes`: one or more finish values
- `hardwarePreferences`: zero or more hardware preference values
- `additionalDescription`: optional text, max 1000 characters
- `budgetRange`: optional enum matching the V1 ranges
- `status`: enum `NOVO`, `EM_ANALISE`, `ORCADO`, `ENCERRADO`
- `statusVersion`: integer incremented on each status change
- `statusUpdatedAt`: timestamp of the latest status change
- `receiptStatus`: enum `PENDING`, `SENT`, `FAILED`
- `receiptAttemptedAt`: nullable timestamp
- `receiptFailureReason`: nullable short text for admin recovery
- `lgpdConsentAccepted`: boolean, must be true for creation
- `lgpdConsentTextVersion`: consent copy/version shown at submission time
- `lgpdConsentAcceptedAt`: timestamp
- `personalDataAnonymizedAt`: nullable timestamp
- `quotedValue`: nullable decimal, reserved for V2
- `pricingBreakdown`: nullable JSON, reserved for V2
- `createdAt`: submission timestamp
- `updatedAt`: latest record update timestamp

### Relationships

- Has many `QuotationPhoto`
- Has many `InternalNote`
- Created by anonymous customer input
- Managed by `AdminUser`

### Validation Rules

- Protocol must be unique.
- Email and WhatsApp must be present and valid for creation.
- Same normalized email or WhatsApp cannot create another request within 10
  minutes.
- Width, height, and depth must be positive centimeter values.
- `otherFurnitureType` is required only when `furnitureType` is `OUTRO`.
- At least one desired finish must be selected.
- Consent must be accepted before creation.
- `quotedValue` and `pricingBreakdown` remain nullable and unused in V1.

### State Transitions

```text
NOVO -> EM_ANALISE -> ORCADO -> ENCERRADO
NOVO -> ORCADO
NOVO -> ENCERRADO
EM_ANALISE -> ENCERRADO
ORCADO -> ENCERRADO
```

Status changes require optimistic concurrency using `statusVersion` or
`statusUpdatedAt`. If the submitted marker is stale, the change is rejected and
the admin must refresh.

## QuotationPhoto

Represents one optional project image uploaded with a quotation request.

### Fields

- `id`: unique identifier
- `quotationRequestId`: parent request identifier
- `storagePath`: Supabase Storage path
- `originalFileName`: original uploaded file name
- `contentType`: must be jpg, png, or webp
- `sizeBytes`: maximum 5 MB
- `status`: enum `AVAILABLE`, `UNAVAILABLE`, `REMOVED_FOR_PRIVACY`
- `createdAt`: upload timestamp

### Relationships

- Belongs to one `QuotationRequest`

### Validation Rules

- Maximum 3 photos per request.
- Unsupported content types are rejected.
- Oversized files are rejected.
- Photos are removed or anonymized when a deletion request is fulfilled.

## InternalNote

Represents a private admin note attached to one request.

### Fields

- `id`: unique identifier
- `quotationRequestId`: parent request identifier
- `authorAdminUserId`: admin author identifier
- `body`: required note text
- `containsAnonymizedContent`: boolean
- `createdAt`: timestamp

### Relationships

- Belongs to one `QuotationRequest`
- Authored by one `AdminUser`

### Validation Rules

- Notes are append-only after saving.
- Notes are never visible to customers.
- During deletion-request fulfillment, personal identifiers inside `body` are
  anonymized while the note remains in operational history.

## AdminUser

Represents the authenticated workshop user for V1.

### Fields

- `id`: identifier aligned with Supabase Auth user
- `email`: unique admin email
- `role`: enum `ADMIN`; schema preserves future `CUSTOMER` and `SUPER_ADMIN`
- `createdAt`: timestamp
- `lastLoginAt`: nullable timestamp

### Relationships

- Has many `InternalNote`
- Performs status updates and admin reply actions

### Validation Rules

- Admin routes and mutations require authenticated `ADMIN` authorization.
- V1 exposes only one active admin user, but the model does not prevent later
  role expansion.

## ReplyAction

Derived action, not necessarily a persisted table in V1.

### Fields

- `quotationRequestId`: source request
- `channel`: `EMAIL` or `WHATSAPP`
- `recipient`: email address or normalized WhatsApp phone
- `subject`: email-only subject including protocol
- `message`: pre-filled Portuguese response template including protocol
- `isPreferredChannel`: whether it matches the customer preference

### Validation Rules

- Reply actions are only available to authenticated admins.
- Message templates must include the protocol.
- Actions open external email or WhatsApp clients; they do not mark a request
  as quoted automatically.

## StaticPageContent

Represents static content for required V1 pages.

### Fields

- `page`: `PRIVACIDADE` or `CONTATO`
- `title`: display title
- `body`: page content
- `lastReviewedAt`: nullable date

### Validation Rules

- Privacy content must describe data collection, consent, quotation use,
  deletion requests, and contact method for privacy requests.
- Contact content must include address, phone, and email; map embed is optional.

## ServiceScopeNotice

Represents homepage-only alert content shown before visitors interact with the
quotation page. This is not a persisted database entity in V1.

### Fields

- `body`: required Brazilian Portuguese service-scope copy explaining accepted
  and rejected request types
- `acknowledgementLabel`: exact button label, "Entendo o que não pedir"
- `isOpen`: transient client-side UI state for the current page session

### Relationships

- Rendered by the public homepage before the quotation form can be used
- Does not relate to `QuotationRequest` and does not create audit or consent
  records

### Validation Rules

- Copy must state that the workshop acts exclusively with new, personalized,
  medium/high-standard planned furniture.
- Copy must state that reforms, repairs, old-furniture maintenance, board
  cuts, loose MDF pieces, solid-wood services, low-quality MDF, and
  internet-purchased furniture installation are not performed.
- The acknowledgement button must close the alert without navigating away from
  `/`.
