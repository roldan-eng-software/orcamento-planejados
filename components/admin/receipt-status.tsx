export function ReceiptStatus({ status, reason }: { status: string; reason?: string | null }) {
  if (status !== "FAILED") return <p className="text-sm text-emerald-700">Recibo enviado ou pendente.</p>;
  return (
    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
      <strong>Falha no recibo:</strong> {reason ?? "sem detalhe informado"}
    </div>
  );
}
