import { describe, expect, it } from "vitest";
import { quotationFormSchema } from "@/lib/validation/quotation";

const validInput = {
  fullName: "Maria Silva",
  email: "maria@example.com",
  whatsapp: "(11) 91234-5678",
  preferredContactChannel: "WHATSAPP",
  furnitureType: "COZINHA_PLANEJADA",
  installationRoom: "Cozinha",
  approxWidthCm: 300,
  approxHeightCm: 240,
  approxDepthCm: 60,
  desiredFinishes: ["MDF_BRANCO"],
  hardwarePreferences: [],
  lgpdConsentAccepted: true,
};

describe("quotationFormSchema", () => {
  it("accepts a valid quotation request", () => {
    expect(quotationFormSchema.safeParse(validInput).success).toBe(true);
  });

  it("requires otherFurnitureType when furniture type is OUTRO", () => {
    const result = quotationFormSchema.safeParse({ ...validInput, furnitureType: "OUTRO" });
    expect(result.success).toBe(false);
  });

  it("rejects missing consent and invalid dimensions", () => {
    const result = quotationFormSchema.safeParse({
      ...validInput,
      approxWidthCm: 0,
      lgpdConsentAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts technical visit when technical 3D project is requested", () => {
    const result = quotationFormSchema.safeParse({
      ...validInput,
      wantsTechnical3DProject: true,
      wantsTechnicalVisit: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects technical visit without technical 3D project", () => {
    const result = quotationFormSchema.safeParse({
      ...validInput,
      wantsTechnical3DProject: false,
      wantsTechnicalVisit: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.wantsTechnicalVisit?.[0]).toBe(
        "A visita técnica só é permitida se contratar o projeto 3D técnico.",
      );
    }
  });
});
