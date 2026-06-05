import { addInternalNote } from "@/app/actions/admin-requests";

type Note = {
  id: string;
  body: string;
  createdAt: Date;
  containsAnonymizedContent: boolean;
};

export function InternalNotes({ requestId, notes }: { requestId: string; notes: Note[] }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold">Notas internas</h2>
      <form action={addInternalNote} className="grid gap-2">
        <input type="hidden" name="requestId" value={requestId} />
        <textarea className="rounded-md border border-[var(--line)] p-3" name="body" rows={3} />
        <button className="w-fit rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">
          Salvar nota
        </button>
      </form>
      <ul className="grid gap-2">
        {notes.map((note) => (
          <li className="rounded-md border border-[var(--line)] bg-slate-50 p-3 text-sm" key={note.id}>
            <p>{note.body}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {new Date(note.createdAt).toLocaleString("pt-BR")}
              {note.containsAnonymizedContent ? " · conteúdo anonimizado" : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
