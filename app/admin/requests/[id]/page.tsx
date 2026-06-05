import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { getQuotationRequestById } from "@/lib/quotation/requests";
import { RequestDetail } from "@/components/admin/request-detail";

export const dynamic = "force-dynamic";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const request = await getQuotationRequestById(id);
  if (!request) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RequestDetail request={request} />
    </main>
  );
}
