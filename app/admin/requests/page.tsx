import { requireAdminSession } from "@/lib/auth/session";
import { listAdminRequests } from "@/lib/admin/request-queries";
import { RequestFilters } from "@/components/admin/request-filters";
import { RequestList } from "@/components/admin/request-list";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdminSession();
  const filters = await searchParams;
  const { items, total, page, pageCount } = await listAdminRequests({
    search: filters.search,
    status: filters.status,
    furnitureType: filters.furnitureType,
    from: filters.from,
    to: filters.to,
    page: filters.page ? Number(filters.page) : 1,
  });

  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Pedidos de orçamento</h1>
        <p className="text-sm text-[var(--muted)]">{total} pedido(s) · página {page} de {pageCount}</p>
      </div>
      <RequestFilters />
      <RequestList items={items} />
    </main>
  );
}
