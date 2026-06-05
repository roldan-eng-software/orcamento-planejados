import { CheckCircle2 } from "lucide-react";

const checklist = [
  "Tipo de móvel planejado",
  "Medidas aproximadas em centímetros",
  "Preferências de material e acabamento",
  "Fotos do ambiente, se já tiver",
  "Contato por e-mail ou WhatsApp",
];

export function LandingGuidance() {
  return (
    <section className="grid gap-8 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
          Móveis planejados sob medida
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950 md:text-5xl">
          Conte o que você precisa e receba um retorno organizado do marceneiro.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-700">
          A Roldan Marcenaria substitui conversas soltas por um pedido de orçamento com protocolo,
          fotos opcionais e todas as informações para iniciar uma avaliação manual.
        </p>
      </div>
      <div className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Tenha em mãos</h2>
        <ul className="mt-4 grid gap-3">
          {checklist.map((item) => (
            <li className="flex gap-3 text-sm text-slate-700" key={item}>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
