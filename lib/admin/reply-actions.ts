import type { QuotationRequest } from "@prisma/client";
import { buildEmailReply, buildWhatsappReply } from "./reply-templates";

export function getReplyActions(request: QuotationRequest) {
  return {
    email: request.customerEmail
      ? {
          href: buildEmailReply({ email: request.customerEmail, protocol: request.protocol }),
          preferred: request.preferredContactChannel === "EMAIL",
        }
      : null,
    whatsapp: request.customerWhatsapp
      ? {
          href: buildWhatsappReply({ whatsapp: request.customerWhatsapp, protocol: request.protocol }),
          preferred: request.preferredContactChannel === "WHATSAPP",
        }
      : null,
  };
}
