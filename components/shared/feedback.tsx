export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-md border border-dashed border-[var(--line)] bg-white p-6 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
}

export function LoadingBlock() {
  return <div className="h-24 animate-pulse rounded-md bg-slate-200" />;
}
