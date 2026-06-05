import { contactContent } from "@/lib/content/static-pages";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{contactContent.title}</h1>
      <dl className="mt-6 grid gap-3 rounded-md border border-[var(--line)] bg-white p-5">
        <div>
          <dt className="text-sm font-semibold">Endereço</dt>
          <dd>{contactContent.address}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold">Telefone</dt>
          <dd>{contactContent.phone}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold">E-mail</dt>
          <dd>{contactContent.email}</dd>
        </div>
      </dl>
      <section className="mt-6 rounded-md border border-dashed border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">
        Mapa do Google pode ser incorporado aqui antes do lançamento.
      </section>
    </main>
  );
}
