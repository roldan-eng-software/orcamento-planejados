-- Add paid technical 3D project and technical visit request metadata.
ALTER TABLE "QuotationRequest"
  ADD COLUMN "wantsTechnical3DProject" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "technical3DProjectFeeCents" INTEGER,
  ADD COLUMN "wantsTechnicalVisit" BOOLEAN NOT NULL DEFAULT false;
