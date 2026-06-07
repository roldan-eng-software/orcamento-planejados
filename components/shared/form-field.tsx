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
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-800">
      <span>{label}</span>
      {children}
      {error ? <span className="break-words text-xs font-normal text-red-700">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring w-full min-w-0 max-w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 shadow-sm";
