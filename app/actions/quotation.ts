"use server";

import { revalidatePath } from "next/cache";
import { generateProtocol } from "@/lib/quotation/protocol";
import { createQuotationRequest, findRecentRequestByContact } from "@/lib/quotation/requests";
import { formDataToQuotationInput, quotationFormSchema } from "@/lib/validation/quotation";
import { getRetryAt } from "@/lib/quotation/throttle";
import { storeQuotationPhotos } from "@/lib/storage/quotation-photos";
import { sendQuotationReceipt } from "@/lib/email/quotation-receipt";

export type QuotationActionState = {
  ok: boolean;
  protocol?: string;
  message?: string;
  receiptStatus?: "SENT" | "FAILED";
  fieldErrors?: Record<string, string[]>;
};

export async function submitQuotationRequest(
  _prevState: QuotationActionState,
  formData: FormData,
): Promise<QuotationActionState> {
  const parsed = quotationFormSchema.safeParse(formDataToQuotationInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const recent = await findRecentRequestByContact(parsed.data.email, parsed.data.whatsapp);
  if (recent) {
    const retryAt = getRetryAt(recent.createdAt);
    return {
      ok: false,
      message: `Já recebemos uma solicitação recente deste contato. Tente novamente após ${retryAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`,
    };
  }

  const files = formData
    .getAll("photos")
    .filter((file): file is File => file instanceof File && file.size > 0);
  const protocol = generateProtocol();
  const uploadResult = await storeQuotationPhotos(protocol, files);
  if (!uploadResult.ok) {
    return { ok: false, message: uploadResult.message };
  }

  const receipt = await sendQuotationReceipt({
    to: parsed.data.email,
    name: parsed.data.fullName,
    protocol,
    wantsTechnical3DProject: parsed.data.wantsTechnical3DProject,
    wantsTechnicalVisit: parsed.data.wantsTechnicalVisit,
  });

  await createQuotationRequest({
    protocol,
    data: parsed.data,
    photos: uploadResult.photos,
    receiptStatus: receipt.status,
    receiptFailureReason: receipt.failureReason,
  });

  revalidatePath("/");
  return {
    ok: true,
    protocol,
    receiptStatus: receipt.status,
    message: "Pedido recebido. Em breve entraremos em contato.",
  };
}
