import { LandingGuidance } from "@/components/quotation/landing-guidance";
import { QuotationForm } from "@/components/quotation/quotation-form";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <LandingGuidance />
      <section className="grid gap-4" id="orcamento">
        <h2 className="text-2xl font-bold">Solicite seu orçamento</h2>
        <QuotationForm />
      </section>
    </main>
  );
}
