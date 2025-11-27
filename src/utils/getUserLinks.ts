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
