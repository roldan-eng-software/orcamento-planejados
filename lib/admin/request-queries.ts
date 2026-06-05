import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

export type RequestListFilters = {
  status?: string;
  furnitureType?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
};

export async function listAdminRequests(filters: RequestListFilters = {}) {
  const prisma = getPrisma();
  const page = Math.max(filters.page ?? 1, 1);
  const where: Prisma.QuotationRequestWhereInput = {};

  if (filters.status) where.status = filters.status as Prisma.EnumRequestStatusFilter<"QuotationRequest">;
  if (filters.furnitureType) where.furnitureType = filters.furnitureType as Prisma.EnumFurnitureTypeFilter<"QuotationRequest">;
  if (filters.from || filters.to) {
    where.createdAt = {
      gte: filters.from ? new Date(filters.from) : undefined,
      lte: filters.to ? new Date(filters.to) : undefined,
    };
  }
  if (filters.search) {
    where.OR = [
      { protocol: { contains: filters.search, mode: "insensitive" } },
      { customerName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.quotationRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.quotationRequest.count({ where }),
  ]);

  return { items, total, page, pageCount: Math.max(Math.ceil(total / 20), 1) };
}
