"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/auth/session";
import { anonymizeText, anonymizedCustomerName } from "@/lib/privacy/anonymize";
import { anonymizeSchema, internalNoteSchema, updateStatusSchema } from "@/lib/validation/admin-request";

const quotationRequestWithPrivacyRelations = {
  include: { notes: true, photos: true },
} satisfies Prisma.QuotationRequestDefaultArgs;

type QuotationRequestWithPrivacyRelations = Prisma.QuotationRequestGetPayload<
  typeof quotationRequestWithPrivacyRelations
>;

export async function updateRequestStatus(formData: FormData) {
  await requireAdminSession();
  const parsed = updateStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    nextStatus: formData.get("nextStatus"),
    expectedStatusVersion: formData.get("expectedStatusVersion"),
  });
  if (!parsed.success) return;

  const prisma = getPrisma();
  const current = await prisma.quotationRequest.findUnique({ where: { id: parsed.data.requestId } });
  if (!current) return;
  if (current.statusVersion !== parsed.data.expectedStatusVersion) {
    return;
  }

  await prisma.quotationRequest.update({
    where: { id: parsed.data.requestId },
    data: {
      status: parsed.data.nextStatus,
      statusVersion: { increment: 1 },
      statusUpdatedAt: new Date(),
    },
  });
  revalidatePath(`/admin/requests/${parsed.data.requestId}`);
  revalidatePath("/admin/requests");
}

export async function addInternalNote(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = internalNoteSchema.safeParse({
    requestId: formData.get("requestId"),
    body: formData.get("body"),
  });
  if (!parsed.success) return;

  await getPrisma().internalNote.create({
    data: {
      quotationRequestId: parsed.data.requestId,
      authorAdminUserId: session.user.id,
      body: parsed.data.body,
    },
  });
  revalidatePath(`/admin/requests/${parsed.data.requestId}`);
}

export async function anonymizeQuotationPersonalData(formData: FormData) {
  await requireAdminSession();
  const parsed = anonymizeSchema.safeParse({
    requestId: formData.get("requestId"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) return;

  const prisma = getPrisma();
  const request: QuotationRequestWithPrivacyRelations | null = await prisma.quotationRequest.findUnique({
    where: { id: parsed.data.requestId },
    ...quotationRequestWithPrivacyRelations,
  });
  if (!request) return;
  if (request.personalDataAnonymizedAt) return;

  await prisma.$transaction([
    prisma.quotationRequest.update({
      where: { id: request.id },
      data: {
        customerName: anonymizedCustomerName(),
        customerEmail: null,
        customerWhatsapp: null,
        normalizedEmail: null,
        normalizedWhatsapp: null,
        additionalDescription: anonymizeText(request.additionalDescription),
        personalDataAnonymizedAt: new Date(),
      },
    }),
    ...request.notes.map((note) =>
      prisma.internalNote.update({
        where: { id: note.id },
        data: { body: anonymizeText(note.body) ?? "", containsAnonymizedContent: true },
      }),
    ),
    ...request.photos.map((photo) =>
      prisma.quotationPhoto.update({
        where: { id: photo.id },
        data: { status: "REMOVED_FOR_PRIVACY" },
      }),
    ),
  ]);

  revalidatePath(`/admin/requests/${request.id}`);
  revalidatePath("/admin/requests");
}
