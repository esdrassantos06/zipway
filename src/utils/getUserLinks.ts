import { prisma } from "@/lib/prisma";

export async function getUserLinks(userId: string) {
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
    },
  });

  return links.map((link) => ({
    id: link.id,
    shortId: link.shortId,
    originalUrl: link.targetUrl,
    shortUrl: `${process.env.NEXT_PUBLIC_URL}/${link.shortId}`,
    clicks: link.clicks,
    status: link.status,
    createdAt: link.createdAt.toISOString(),
  }));
}
