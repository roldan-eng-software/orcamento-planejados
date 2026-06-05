# Server Action Contracts: OrcaFlex V1

These contracts define the server-side mutation boundaries used by the UI.
They are written as behavior contracts, not implementation code.

## submitQuotationRequest

**Actor**: Anonymous customer

**Purpose**: Create a quotation request from the embedded public form and return
an on-screen confirmation result.

### Input

- `fullName`: required string
- `email`: required email string
- `whatsapp`: required Brazilian WhatsApp phone string
- `preferredContactChannel`: `EMAIL` or `WHATSAPP`
- `furnitureType`: one of the V1 furniture type values
- `otherFurnitureType`: required when furniture type is `OUTRO`
- `installationRoom`: required string
- `approxWidthCm`: required positive number
- `approxHeightCm`: required positive number
- `approxDepthCm`: required positive number
- `desiredFinishes`: one or more V1 finish values
- `hardwarePreferences`: optional list of V1 hardware preference values
- `additionalDescription`: optional string, max 1000 characters
- `budgetRange`: optional V1 budget range
- `photos`: optional list, max 3 jpg/png/webp images, max 5 MB each
- `lgpdConsentAccepted`: required true

### Success Result

- `ok`: true
- `protocol`: generated protocol in `ORC-YYYYMMDD-XXXX` format
- `receiptStatus`: `SENT` or `FAILED`
- `message`: Portuguese confirmation copy for the confirmation card

### Failure Results

- Field validation errors keyed by field name
- Repeat-submission error when normalized email or WhatsApp has submitted within
  the last 10 minutes
- Upload validation errors for unsupported type, too many files, or oversized
  files
- General save failure without creating a partial request

### Side Effects

- Creates `QuotationRequest`
- Stores accepted photos and `QuotationPhoto` metadata
- Attempts receipt email
- Stores `receiptStatus` and failure reason if delivery fails

## signInAdmin

**Actor**: Admin

**Purpose**: Authenticate the workshop owner with email and password.

### Input

- `email`: required email string
- `password`: required string

### Success Result

- `ok`: true
- Redirect target: `/admin/requests`

### Failure Results

- Invalid credentials message
- Authorization failure when authenticated user does not have the `ADMIN` role

## updateRequestStatus

**Actor**: Admin

**Purpose**: Change the request status from the detail view.

### Input

- `requestId`: required request identifier
- `nextStatus`: one of `NOVO`, `EM_ANALISE`, `ORCADO`, `ENCERRADO`
- `expectedStatusVersion` or `expectedStatusUpdatedAt`: required concurrency
  marker from the current detail view

### Success Result

- `ok`: true
- Updated status
- New status version or updated-at marker

### Failure Results

- Unauthorized
- Request not found
- Invalid transition or status value
- Stale update result requiring admin refresh

## addInternalNote

**Actor**: Admin

**Purpose**: Append a private note to a quotation request.

### Input

- `requestId`: required request identifier
- `body`: required note text

### Success Result

- `ok`: true
- Created note timestamp

### Failure Results

- Unauthorized
- Request not found
- Empty note body

## anonymizeQuotationPersonalData

**Actor**: Admin

**Purpose**: Fulfill a customer deletion request while retaining non-personal
operational history.

### Input

- `requestId`: required request identifier
- `confirmation`: explicit admin confirmation phrase or checkbox value

### Success Result

- `ok`: true
- `personalDataAnonymizedAt`: timestamp

### Failure Results

- Unauthorized
- Request not found
- Already anonymized

### Side Effects

- Anonymizes name, email, WhatsApp, and free-text personal identifiers
- Removes or anonymizes photos
- Anonymizes personal identifiers inside internal notes
- Retains protocol, non-personal project fields, status, consent record, and
  operational history
