-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "FurnitureType" AS ENUM ('COZINHA_PLANEJADA', 'GUARDA_ROUPA', 'HOME_OFFICE', 'CLOSET', 'ESTANTE_RACK', 'OUTRO');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NOVO', 'EM_ANALISE', 'ORCADO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "PhotoStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'REMOVED_FOR_PRIVACY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "QuotationRequest" (
    "id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerWhatsapp" TEXT,
    "normalizedEmail" TEXT,
    "normalizedWhatsapp" TEXT,
    "preferredContactChannel" "ContactChannel" NOT NULL,
    "furnitureType" "FurnitureType" NOT NULL,
    "otherFurnitureType" TEXT,
    "installationRoom" TEXT NOT NULL,
    "approxWidthCm" DECIMAL(65,30) NOT NULL,
    "approxHeightCm" DECIMAL(65,30) NOT NULL,
    "approxDepthCm" DECIMAL(65,30) NOT NULL,
    "desiredFinishes" TEXT[],
    "hardwarePreferences" TEXT[],
    "additionalDescription" TEXT,
    "budgetRange" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'NOVO',
    "statusVersion" INTEGER NOT NULL DEFAULT 1,
    "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiptStatus" "ReceiptStatus" NOT NULL DEFAULT 'PENDING',
    "receiptAttemptedAt" TIMESTAMP(3),
    "receiptFailureReason" TEXT,
    "lgpdConsentAccepted" BOOLEAN NOT NULL,
    "lgpdConsentTextVersion" TEXT NOT NULL,
    "lgpdConsentAcceptedAt" TIMESTAMP(3) NOT NULL,
    "personalDataAnonymizedAt" TIMESTAMP(3),
    "quotedValue" DECIMAL(65,30),
    "pricingBreakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationPhoto" (
    "id" TEXT NOT NULL,
    "quotationRequestId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "PhotoStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" TEXT NOT NULL,
    "quotationRequestId" TEXT NOT NULL,
    "authorAdminUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "containsAnonymizedContent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuotationRequest_protocol_key" ON "QuotationRequest"("protocol");

-- CreateIndex
CREATE INDEX "QuotationRequest_createdAt_idx" ON "QuotationRequest"("createdAt");

-- CreateIndex
CREATE INDEX "QuotationRequest_status_idx" ON "QuotationRequest"("status");

-- CreateIndex
CREATE INDEX "QuotationRequest_normalizedEmail_createdAt_idx" ON "QuotationRequest"("normalizedEmail", "createdAt");

-- CreateIndex
CREATE INDEX "QuotationRequest_normalizedWhatsapp_createdAt_idx" ON "QuotationRequest"("normalizedWhatsapp", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "QuotationPhoto" ADD CONSTRAINT "QuotationPhoto_quotationRequestId_fkey" FOREIGN KEY ("quotationRequestId") REFERENCES "QuotationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_quotationRequestId_fkey" FOREIGN KEY ("quotationRequestId") REFERENCES "QuotationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_authorAdminUserId_fkey" FOREIGN KEY ("authorAdminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
