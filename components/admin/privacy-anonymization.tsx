import { anonymizeQuotationPersonalData } from "@/app/actions/admin-requests";

export function PrivacyAnonymization({ requestId, disabled }: { requestId: string; disabled: boolean }) {
  return (
    <form action={anonymizeQuotationPersonalData} className="rounded-md border border-[var(--line)] bg-white p-4">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="confirmation" value="ANONIMIZAR" />
      <h2 className="text-lg font-semibold">Solicitação LGPD</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Anonimiza dados pessoais, fotos e identificadores pessoais nas notas internas.
      </p>
      <button className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={disabled}>
        {disabled ? "Dados já anonimizados" : "Anonimizar dados pessoais"}
      </button>
    </form>
  );
}
