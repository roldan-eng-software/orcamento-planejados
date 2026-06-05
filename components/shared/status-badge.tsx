import { statusLabels } from "@/lib/quotation/options";

const classes = {
  NOVO: "bg-blue-100 text-blue-800",
  EM_ANALISE: "bg-amber-100 text-amber-800",
  ORCADO: "bg-emerald-100 text-emerald-800",
  ENCERRADO: "bg-slate-200 text-slate-700",
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusLabels }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
