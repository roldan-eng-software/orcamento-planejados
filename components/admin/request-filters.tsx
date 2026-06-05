import { furnitureTypes, statusLabels } from "@/lib/quotation/options";
import { inputClass } from "@/components/shared/form-field";

export function RequestFilters() {
  return (
    <form className="grid gap-3 rounded-md border border-[var(--line)] bg-white p-4 md:grid-cols-5">
      <label className="grid gap-1 text-xs font-semibold">
        Busca
        <input className={inputClass} name="search" placeholder="Nome ou protocolo" />
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Status
        <select className={inputClass} name="status" defaultValue="">
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Tipo
        <select className={inputClass} name="furnitureType" defaultValue="">
          <option value="">Todos os móveis</option>
          {furnitureTypes.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Desde
        <input className={inputClass} name="from" type="date" />
      </label>
      <button className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">
        Filtrar
      </button>
    </form>
  );
}
