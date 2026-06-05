import { Prisma, type QuotationRequest } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { normalizeContactForThrottle, throttleWindowMs } from "./throttle";
import type { QuotationFormInput } from "@/lib/validation/quotation";
import type { StoredPhoto } from "@/lib/storage/quotation-photos";

export async function findRecentRequestByContact(email: string, whatsapp: string) {
  const prisma = getPrisma();
  const { normalizedEmail, normalizedWhatsapp } = normalizeContactForThrottle(email, whatsapp);
  const since = new Date(Date.now() - throttleWindowMs);
  return prisma.quotationRequest.findFirst({
    where: {
      createdAt: { gte: since },
      OR: [{ normalizedEmail }, { normalizedWhatsapp }],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createQuotationRequest(params: {
  protocol: string;
  data: QuotationFormInput;
  photos: StoredPhoto[];
  receiptStatus: "SENT" | "FAILED";
  receiptFailureReason?: string;
}) {
  const prisma = getPrisma();
  const { normalizedEmail, normalizedWhatsapp } = normalizeContactForThrottle(
    params.data.email,
    params.data.whatsapp,
  );

  return prisma.quotationRequest.create({
    data: {
      protocol: params.protocol,
      customerName: params.data.fullName,
      customerEmail: params.data.email,
      customerWhatsapp: params.data.whatsapp,
      normalizedEmail,
      normalizedWhatsapp,
      preferredContactChannel: params.data.preferredContactChannel,
      furnitureType: params.data.furnitureType,
      otherFurnitureType: params.data.otherFurnitureType || null,
      installationRoom: params.data.installationRoom,
      approxWidthCm: new Prisma.Decimal(params.data.approxWidthCm),
      approxHeightCm: new Prisma.Decimal(params.data.approxHeightCm),
      approxDepthCm: new Prisma.Decimal(params.data.approxDepthCm),
      desiredFinishes: params.data.desiredFinishes,
      hardwarePreferences: params.data.hardwarePreferences,
      additionalDescription: params.data.additionalDescription || null,
      budgetRange: params.data.budgetRange || null,
      receiptStatus: params.receiptStatus,
      receiptAttemptedAt: new Date(),
      receiptFailureReason: params.receiptFailureReason ?? null,
      lgpdConsentAccepted: true,
      lgpdConsentTextVersion: "v1-2026-06-05",
      lgpdConsentAcceptedAt: new Date(),
      photos: {
        create: params.photos.map((photo) => ({
          storagePath: photo.storagePath,
          originalFileName: photo.originalFileName,
          contentType: photo.contentType,
          sizeBytes: photo.sizeBytes,
        })),
      },
    },
    include: { photos: true },
  });
}

export async function getQuotationRequestById(id: string) {
  return getPrisma().quotationRequest.findUnique({
    where: { id },
    include: {
      photos: true,
      notes: { orderBy: { createdAt: "asc" }, include: { author: true } },
    },
  });
}

export type QuotationRequestWithRelations = NonNullable<Awaited<ReturnType<typeof getQuotationRequestById>>>;

export function isAnonymized(request: Pick<QuotationRequest, "personalDataAnonymizedAt">) {
  return Boolean(request.personalDataAnonymizedAt);
}
