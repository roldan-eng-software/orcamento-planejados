# Quickstart: OrcaFlex V1 Validation

## Prerequisites

- Node.js compatible with the selected Next.js version
- Supabase project with Postgres, Auth, and Storage available
- SMTP account credentials for the receipt email function
- Environment variables copied from `.env.example` and filled locally

## Setup

1. Install dependencies.
2. Configure environment variables for database, Supabase, storage bucket,
   Supabase Auth, and SMTP.
3. Apply Prisma migrations.
4. Create or invite the V1 admin user with the `ADMIN` role.
5. Create the storage bucket for quotation photos.
6. Configure SMTP credentials in the deployment environment.
7. Start the local application.

## Validation Scenarios

Run the automated checks before manual validation:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

### 1. Customer submits a valid request

1. Open `/` on a mobile-width viewport.
2. Confirm the service-scope alert appears in front of the homepage.
3. Confirm the alert includes the required copy about accepted planned
   furniture requests and rejected reform/repair/MDF-piece/installation
   requests.
4. Click "Entendo o que não pedir" and confirm the alert closes without
   leaving `/`.
5. Read the service summary and checklist.
6. Confirm the technical visit option is disabled before selecting technical 3D
   project and exposes the help text explaining that the visit is allowed only
   when hiring the 3D project.
7. Select "Projeto 3D técnico" and confirm the form shows the `R$ 100,00` cost
   notice and discount possibility.
8. Confirm the technical visit option becomes enabled, then select it.
9. Fill all required form fields, accept LGPD consent, and submit.
10. Confirm the form is replaced by a confirmation card on the same page.
11. Confirm the protocol matches `ORC-YYYYMMDD-XXXX`.
12. Confirm the request appears in the admin request list/detail with the
   technical 3D project and technical visit choices.

Expected outcome: The request is stored, the protocol is visible, and no
customer account is required. The technical 3D and visit choices are preserved
for admin review.

### 2. Customer validation blocks bad data

1. Submit the form with missing consent, invalid email, invalid WhatsApp, and a
   zero dimension.
2. Submit again with more than 3 images or an unsupported image type.

Expected outcome: Field-level errors identify the exact fields/files to fix and
no request is created.

### 2A. Technical visit requires technical 3D project

1. Attempt to request technical visit before selecting "Projeto 3D técnico".
2. Select "Projeto 3D técnico", then select technical visit.
3. Deselect "Projeto 3D técnico".

Expected outcome: Technical visit is disabled until the technical 3D project is
selected, shows explanatory help while disabled, and is cleared again if the 3D
project option is deselected.

### 3. Repeated submission is throttled

1. Submit a valid request.
2. Submit again within 10 minutes using the same email or WhatsApp.

Expected outcome: The second submission is blocked with a clear retry message.

### 4. Admin reviews and updates request

1. Open `/admin/requests` while signed out.
2. Confirm redirect to `/admin/login`.
3. Sign in as admin.
4. Search by protocol and filter by status.
5. Open the request detail.
6. Change status and add an internal note.

Expected outcome: Protected access works, filters narrow the list, the status is
updated, and the note remains visible only to the admin.

### 5. Stale status update is blocked

1. Open the same request detail in two admin sessions.
2. Change status in the first session.
3. Attempt a conflicting status change from the second session.

Expected outcome: The second update is rejected with a refresh prompt.

### 6. Receipt failure is visible to admin

1. Simulate or configure a receipt email failure.
2. Submit a valid request.
3. Open the admin request list and detail.

Expected outcome: The customer still sees on-screen confirmation and the admin
can see the failed confirmation status in the list and detail.

### 7. Privacy deletion anonymizes personal data

1. Submit a request with photos and an internal note containing personal data.
2. Fulfill a deletion request from the admin detail.
3. Reopen the request.

Expected outcome: Name, email, WhatsApp, photos, and personal identifiers inside
notes are no longer visible. Protocol, non-personal project details, status,
consent history, and operational history remain.

### 8. Static pages are available

1. Open `/privacidade`.
2. Open `/contato`.

Expected outcome: Both pages load in Brazilian Portuguese with the required
privacy and contact content.
