import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export type ReceiptResult =
  | { status: "SENT"; failureReason?: never }
  | { status: "FAILED"; failureReason: string };

export async function sendQuotationReceipt(params: {
  to: string;
  name: string;
  protocol: string;
}): Promise<ReceiptResult> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM_EMAIL) {
    return { status: "FAILED", failureReason: "Configuração SMTP incompleta." };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: params.to,
      subject: `Recebemos seu pedido ${params.protocol}`,
      text: `Olá, ${params.name}. Recebemos seu pedido de orçamento ${params.protocol}. Em breve entraremos em contato.`,
    });

    return { status: "SENT" };
  } catch (error) {
    return {
      status: "FAILED",
      failureReason: error instanceof Error ? error.message : "Falha inesperada no envio.",
    };
  }
}
