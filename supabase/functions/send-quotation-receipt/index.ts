import { Resend } from "npm:resend";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  const { to, name, protocol } = await req.json();
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: Deno.env.get("RESEND_FROM_EMAIL") ?? "OrcaFlex <noreply@example.com>",
    to,
    subject: `Recebemos seu pedido ${protocol}`,
    text: `Olá, ${name}. Recebemos seu pedido de orçamento ${protocol}.`,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
});
