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
      userId: true,
    },
  });

  return links;
}
