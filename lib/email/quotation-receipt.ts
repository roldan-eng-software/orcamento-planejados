import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY ?? "re_missing");
  }
  return resendClient;
}

export type ReceiptResult =
  | { status: "SENT"; failureReason?: never }
  | { status: "FAILED"; failureReason: string };

export async function sendQuotationReceipt(params: {
  to: string;
  name: string;
  protocol: string;
}): Promise<ReceiptResult> {
  if (!process.env.RESEND_API_KEY) {
    return { status: "FAILED", failureReason: "RESEND_API_KEY não configurada." };
  }

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Roldan Marcenaria <roldan.marcenaria@gmail.com>",
      to: params.to,
      subject: `Recebemos seu pedido ${params.protocol}`,
      text: `Olá, ${params.name}. Recebemos seu pedido de orçamento ${params.protocol}. Em breve entraremos em contato.`,
    });

    if (error) return { status: "FAILED", failureReason: error.message };
    return { status: "SENT" };
  } catch (error) {
    return {
      status: "FAILED",
      failureReason: error instanceof Error ? error.message : "Falha inesperada no envio.",
    };
  }
}
