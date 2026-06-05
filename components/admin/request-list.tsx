import Link from "next/link";
import type { AdminRequestListItem } from "@/lib/admin/request-queries";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateBR } from "@/lib/formatting/locale";

export function RequestList({ items }: { items: AdminRequestListItem[] }) {
  if (items.length === 0) {
    return <p className="rounded-md border border-dashed border-[var(--line)] bg-white p-6 text-center">Nenhum pedido encontrado.</p>;
  }

  return (
    <div className="overflow-hidden rounded-md border border-[var(--line)] bg-white">
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-3">Protocolo</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Móvel</th>
            <th className="p-3">Enviado em</th>
            <th className="p-3">Status</th>
            <th className="p-3">Recibo</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-t border-[var(--line)]" key={item.id}>
              <td className="p-3 font-mono"><Link href={`/admin/requests/${item.id}`}>{item.protocol}</Link></td>
              <td className="p-3">{item.customerName ?? "Cliente anonimizado"}</td>
              <td className="p-3">{item.furnitureType}</td>
              <td className="p-3">{formatDateBR(item.createdAt)}</td>
              <td className="p-3"><StatusBadge status={item.status} /></td>
              <td className="p-3">{item.receiptStatus === "FAILED" ? "Falhou" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-3 md:hidden">
        {items.map((item) => (
          <Link className="rounded-md border border-[var(--line)] p-3" href={`/admin/requests/${item.id}`} key={item.id}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm">{item.protocol}</span>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2 font-semibold">{item.customerName ?? "Cliente anonimizado"}</p>
            <p className="text-sm text-[var(--muted)]">{formatDateBR(item.createdAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
