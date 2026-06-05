# UI Flow Contracts: OrcaFlex V1

## Public Landing and Quotation Form

**Route**: `/`

### Required Sections

1. Service summary for planned furniture
2. Checklist of information customers need before filling the form
3. Embedded quotation request form
4. Confirmation card replacing the form after successful submission

### Form Behavior

- All customer-facing copy is Brazilian Portuguese.
- The form stays on the same route before and after submission.
- Required fields show field-level errors.
- The consent checkbox links to `/privacidade`.
- The confirmation card includes the protocol number and receipt status copy.
- Repeat-submission failures explain the 10-minute retry window.

## Admin Login

**Route**: `/admin/login`

### Behavior

- Email and password fields are required.
- Successful admin sign-in opens `/admin/requests`.
- Unauthenticated admin routes redirect here.
- Non-admin authenticated users cannot access request data.

## Admin Request List

**Route**: `/admin/requests`

### Required Data

- Protocol number
- Customer name or anonymized marker
- Furniture type
- Submitted date
- Request status badge
- Failed confirmation indicator when applicable

### Controls

- Status filter
- Date range filter
- Furniture type filter
- Search by customer name or protocol
- Pagination with 20 items per page
- Default newest-first sorting

### Responsive Contract

- Desktop uses a table.
- Mobile uses a card list.
- Active filters persist while changing pages.

## Admin Request Detail

**Route**: `/admin/requests/[id]`

### Required Sections

1. Protocol and current status
2. Customer contact data or anonymized marker
3. Furniture details grouped like the public form
4. Uploaded photo thumbnails and larger view
5. Receipt confirmation status
6. Status selector
7. Internal notes
8. Reply actions
9. Privacy deletion action

### Mutation Behavior

- Status updates include a stale-update check; stale updates prompt refresh.
- Internal notes append chronologically and become read-only after saving.
- Email and WhatsApp reply actions include the protocol in the prepared message.
- Privacy deletion anonymizes personal data and preserves non-personal history.

## Static Pages

### `/privacidade`

- Explains collected data, quotation use, consent, receipt email, optional
  photos, deletion requests, and contact path for privacy requests.

### `/contato`

- Shows workshop address, phone, email, and optional map area.
