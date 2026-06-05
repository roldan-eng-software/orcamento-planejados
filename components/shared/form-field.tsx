import type { ReactNode } from "react";

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-800">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-normal text-red-700">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 shadow-sm";
