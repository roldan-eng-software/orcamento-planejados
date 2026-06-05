export function ConfirmationCard({
  protocol,
  receiptStatus,
}: {
  protocol: string;
  receiptStatus?: "SENT" | "FAILED";
}) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-semibold text-emerald-800">Pedido recebido</p>
      <h2 className="mt-2 text-2xl font-bold text-emerald-950">{protocol}</h2>
      <p className="mt-3 text-sm text-emerald-900">
        Guarde este protocolo. Vamos analisar as informações e entrar em contato pelo canal informado.
      </p>
      {receiptStatus === "FAILED" ? (
        <p className="mt-3 text-sm text-amber-800">
          O recibo por e-mail não foi enviado agora, mas seu pedido foi registrado.
        </p>
      ) : null}
    </div>
  );
}
