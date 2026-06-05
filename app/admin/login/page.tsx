import { signInAdmin } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
      <form action={signInAdmin} className="grid w-full gap-4 rounded-md border border-[var(--line)] bg-white p-6">
        <h1 className="text-2xl font-bold">Acesso admin</h1>
        <label className="grid gap-2 text-sm font-medium">
          E-mail
          <input className="rounded-md border border-[var(--line)] px-3 py-2" name="email" type="email" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Senha
          <input className="rounded-md border border-[var(--line)] px-3 py-2" name="password" type="password" />
        </label>
        <button className="rounded-md bg-[var(--brand)] px-4 py-2 font-semibold text-white">Entrar</button>
      </form>
    </main>
  );
}
