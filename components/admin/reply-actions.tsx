import { Mail, MessageCircle } from "lucide-react";

export function ReplyActions({
  email,
  whatsapp,
}: {
  email: { href: string; preferred: boolean } | null;
  whatsapp: { href: string; preferred: boolean } | null;
}) {
  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold">Responder cliente</h2>
      <div className="flex flex-wrap gap-3">
        {email ? (
          <a className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold" href={email.href}>
            <Mail className="h-4 w-4" />
            Responder por e-mail {email.preferred ? "(preferido)" : ""}
          </a>
        ) : null}
        {whatsapp ? (
          <a className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold" href={whatsapp.href} rel="noreferrer" target="_blank">
            <MessageCircle className="h-4 w-4" />
            Responder no WhatsApp {whatsapp.preferred ? "(preferido)" : ""}
          </a>
        ) : null}
      </div>
    </section>
  );
}
