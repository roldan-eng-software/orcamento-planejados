import { normalizeWhatsapp } from "@/lib/formatting/locale";

export function buildEmailReply(params: { email: string; protocol: string }) {
  const subject = `Orçamento ${params.protocol}`;
  const body = `Olá! Estamos analisando seu pedido ${params.protocol} e entraremos em contato com os próximos passos.`;
  return `mailto:${encodeURIComponent(params.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildWhatsappReply(params: { whatsapp: string; protocol: string }) {
  const message = `Olá! Estamos analisando seu pedido ${params.protocol} e entraremos em contato com os próximos passos.`;
  return `https://wa.me/${normalizeWhatsapp(params.whatsapp)}?text=${encodeURIComponent(message)}`;
}
