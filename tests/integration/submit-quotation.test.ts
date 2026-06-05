import { describe, expect, it } from "vitest";
import { formDataToQuotationInput, quotationFormSchema } from "@/lib/validation/quotation";

describe("submitQuotationRequest contract", () => {
  it("maps FormData into the quotation schema", () => {
    const formData = new FormData();
    formData.set("fullName", "Maria Silva");
    formData.set("email", "maria@example.com");
    formData.set("whatsapp", "(11) 91234-5678");
    formData.set("preferredContactChannel", "WHATSAPP");
    formData.set("furnitureType", "CLOSET");
    formData.set("installationRoom", "Quarto");
    formData.set("approxWidthCm", "250");
    formData.set("approxHeightCm", "240");
    formData.set("approxDepthCm", "60");
    formData.append("desiredFinishes", "MDF_BRANCO");
    formData.set("wantsTechnical3DProject", "on");
    formData.set("wantsTechnicalVisit", "on");
    formData.set("lgpdConsentAccepted", "on");

    const result = quotationFormSchema.safeParse(formDataToQuotationInput(formData));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.wantsTechnical3DProject).toBe(true);
      expect(result.data.wantsTechnicalVisit).toBe(true);
    }
  });

  it("rejects manipulated FormData that requests technical visit without 3D project", () => {
    const formData = new FormData();
    formData.set("fullName", "Maria Silva");
    formData.set("email", "maria@example.com");
    formData.set("whatsapp", "(11) 91234-5678");
    formData.set("preferredContactChannel", "WHATSAPP");
    formData.set("furnitureType", "CLOSET");
    formData.set("installationRoom", "Quarto");
    formData.set("approxWidthCm", "250");
    formData.set("approxHeightCm", "240");
    formData.set("approxDepthCm", "60");
    formData.append("desiredFinishes", "MDF_BRANCO");
    formData.set("wantsTechnicalVisit", "on");
    formData.set("lgpdConsentAccepted", "on");

    const result = quotationFormSchema.safeParse(formDataToQuotationInput(formData));
    expect(result.success).toBe(false);
  });
});
