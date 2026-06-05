import { z } from "zod";
import { budgetRanges } from "@/lib/quotation/options";
import { onlyDigits } from "@/lib/formatting/locale";

const furnitureType = z.enum([
  "COZINHA_PLANEJADA",
  "GUARDA_ROUPA",
  "HOME_OFFICE",
  "CLOSET",
  "ESTANTE_RACK",
  "OUTRO",
]);

const finish = z.enum(["MDF_BRANCO", "MDF_MADEIRA", "MDF_ESCURO", "LACA", "NAO_SEI"]);
const hardware = z.enum(["SOFT_CLOSE", "PUXADORES_INOX", "ILUMINACAO_INTERNA", "SEM_PREFERENCIA"]);

export const quotationFormSchema = z
  .object({
    fullName: z.string().trim().min(3, "Informe seu nome completo."),
    email: z.string().trim().email("Informe um e-mail válido."),
    whatsapp: z
      .string()
      .trim()
      .refine((value) => onlyDigits(value).replace(/^55/, "").length === 11, "Informe um WhatsApp com DDD."),
    preferredContactChannel: z.enum(["EMAIL", "WHATSAPP"]),
    furnitureType,
    otherFurnitureType: z.string().trim().optional(),
    installationRoom: z.string().trim().min(2, "Informe o ambiente de instalação."),
    approxWidthCm: z.coerce.number().positive("Informe uma largura positiva."),
    approxHeightCm: z.coerce.number().positive("Informe uma altura positiva."),
    approxDepthCm: z.coerce.number().positive("Informe uma profundidade positiva."),
    desiredFinishes: z.array(finish).min(1, "Escolha ao menos um acabamento."),
    hardwarePreferences: z.array(hardware).default([]),
    additionalDescription: z.string().trim().max(1000, "Use no máximo 1000 caracteres.").optional(),
    budgetRange: z.enum(budgetRanges).optional().or(z.literal("")),
    lgpdConsentAccepted: z.literal(true, {
      error: "Você precisa aceitar a Política de Privacidade.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.furnitureType === "OUTRO" && !data.otherFurnitureType?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["otherFurnitureType"],
        message: "Descreva o tipo de móvel.",
      });
    }
  });

export type QuotationFormInput = z.infer<typeof quotationFormSchema>;

export function formDataToQuotationInput(formData: FormData) {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    preferredContactChannel: String(formData.get("preferredContactChannel") ?? "WHATSAPP"),
    furnitureType: String(formData.get("furnitureType") ?? ""),
    otherFurnitureType: String(formData.get("otherFurnitureType") ?? ""),
    installationRoom: String(formData.get("installationRoom") ?? ""),
    approxWidthCm: formData.get("approxWidthCm"),
    approxHeightCm: formData.get("approxHeightCm"),
    approxDepthCm: formData.get("approxDepthCm"),
    desiredFinishes: formData.getAll("desiredFinishes").map(String),
    hardwarePreferences: formData.getAll("hardwarePreferences").map(String),
    additionalDescription: String(formData.get("additionalDescription") ?? ""),
    budgetRange: String(formData.get("budgetRange") ?? ""),
    lgpdConsentAccepted: formData.get("lgpdConsentAccepted") === "on",
  };
}
