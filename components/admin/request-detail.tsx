import type { QuotationRequestWithRelations } from "@/lib/quotation/requests";
import { updateRequestStatus } from "@/app/actions/admin-requests";
import { StatusBadge } from "@/components/shared/status-badge";
import { statusLabels } from "@/lib/quotation/options";
import { ReceiptStatus } from "./receipt-status";
import { InternalNotes } from "./internal-notes";
import { PrivacyAnonymization } from "./privacy-anonymization";
import { ReplyActions } from "./reply-actions";
import { getReplyActions } from "@/lib/admin/reply-actions";

export function RequestDetail({ request }: { request: QuotationRequestWithRelations }) {
  const actions = getReplyActions(request);

  return (
    <div className="grid gap-6">
      <section className="rounded-md border border-[var(--line)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-sm text-[var(--muted)]">{request.protocol}</p>
            <h1 className="text-2xl font-bold">{request.customerName ?? "Cliente anonimizado"}</h1>
          </div>
          <StatusBadge status={request.status} />
        </div>
        <ReceiptStatus status={request.receiptStatus} reason={request.receiptFailureReason} />
      </section>

      <section className="grid gap-3 rounded-md border border-[var(--line)] bg-white p-5 md:grid-cols-2">
        <p><strong>E-mail:</strong> {request.customerEmail ?? "anonimizado"}</p>
        <p><strong>WhatsApp:</strong> {request.customerWhatsapp ?? "anonimizado"}</p>
        <p><strong>Móvel:</strong> {request.furnitureType}</p>
        <p><strong>Ambiente:</strong> {request.installationRoom}</p>
        <p><strong>Medidas:</strong> {String(request.approxWidthCm)} x {String(request.approxHeightCm)} x {String(request.approxDepthCm)} cm</p>
        <p><strong>Acabamentos:</strong> {request.desiredFinishes.join(", ")}</p>
      </section>

      <section className="grid gap-3 rounded-md border border-[var(--line)] bg-white p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Projeto e visita técnica</h2>
        <p>
          <strong>Projeto 3D técnico:</strong>{" "}
          {request.wantsTechnical3DProject ? "Solicitado (R$ 100,00)" : "Não solicitado"}
        </p>
        <p>
          <strong>Visita técnica:</strong> {request.wantsTechnicalVisit ? "Solicitada" : "Não solicitada"}
        </p>
      </section>

      <section className="rounded-md border border-[var(--line)] bg-white p-5">
        <h2 className="text-lg font-semibold">Atualizar status</h2>
        <form action={updateRequestStatus} className="mt-3 flex flex-wrap gap-3">
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="expectedStatusVersion" value={request.statusVersion} />
          <select className="rounded-md border border-[var(--line)] px-3 py-2" name="nextStatus" defaultValue={request.status}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Salvar status</button>
        </form>
      </section>

      <section className="rounded-md border border-[var(--line)] bg-white p-5">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {request.photos.length === 0 ? <p className="text-sm text-[var(--muted)]">Nenhuma foto enviada.</p> : null}
          {request.photos.map((photo) => (
            <div className="rounded-md border border-[var(--line)] p-3 text-sm" key={photo.id}>
              <p>{photo.originalFileName}</p>
              <p className="text-[var(--muted)]">{photo.status}</p>
            </div>
          ))}
        </div>
      </section>

      <ReplyActions email={actions.email} whatsapp={actions.whatsapp} />
      <InternalNotes requestId={request.id} notes={request.notes} />
      <PrivacyAnonymization requestId={request.id} disabled={Boolean(request.personalDataAnonymizedAt)} />
    </div>
  );
}
