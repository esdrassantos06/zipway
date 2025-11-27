import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function getUserLinksUncached(userId: string) {
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      shortId: true,
      targetUrl: true,
      clicks: true,
      createdAt: true,
      status: true,
      userId: true,
    },
    take: 1000,
  });

  return links;
}

async function getUserLinksPageUncached(
  userId: string,
  page: number,
  pageSize: number,
) {
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const total = await prisma.link.count({
    where: { userId },
  });

  const maxPage = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), maxPage);
  const skip = (safePage - 1) * safePageSize;

  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      shortId: true,
      targetUrl: true,
      clicks: true,
      createdAt: true,
      status: true,
      userId: true,
    },
    skip,
    take: safePageSize,
  });

  return {
    links,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: maxPage,
  };
}

export async function getUserLinks(userId: string) {
  return unstable_cache(
    async () => getUserLinksUncached(userId),
    [`user-links-${userId}`],
    {
      revalidate: 30,
      tags: [`user-links-${userId}`],
    },
  )();
}

export async function getUserLinksPage(
  userId: string,
  page = 1,
  pageSize = 10,
) {
  return unstable_cache(
    () => getUserLinksPageUncached(userId, page, pageSize),
    [`user-links-${userId}-${page}-${pageSize}`],
    {
      revalidate: 30,
      tags: [`user-links-${userId}`],
    },
  )();
}
