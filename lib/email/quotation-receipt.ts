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
  wantsTechnical3DProject?: boolean;
  wantsTechnicalVisit?: boolean;
}): Promise<ReceiptResult> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM_EMAIL) {
    return { status: "FAILED", failureReason: "Configuração SMTP incompleta." };
  }

  const technical3DText = params.wantsTechnical3DProject
    ? " Você também solicitou o projeto 3D técnico, com custo de R$ 100,00 que poderá ser usado como desconto no fechamento do contrato de fabricação."
    : "";
  const technicalVisitText = params.wantsTechnicalVisit
    ? " A visita técnica também foi marcada como interesse para nossa avaliação."
    : "";

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: params.to,
      subject: `Recebemos seu pedido ${params.protocol}`,
      text: `Olá, ${params.name}. Recebemos seu pedido de orçamento ${params.protocol}. Em breve entraremos em contato.${technical3DText}${technicalVisitText}`,
    });

    return { status: "SENT" };
  } catch (error) {
    return {
      status: "FAILED",
      failureReason: error instanceof Error ? error.message : "Falha inesperada no envio.",
    };
  }
}
