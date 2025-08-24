import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LinkStatus } from "@/generated/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  const resolvedParams = await params;
  const shortId = resolvedParams.shortId;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingLink = await tx.link.findUnique({
        where: { shortId },
        select: {
          targetUrl: true,
          status: true,
        },
      });

      if (!existingLink) {
        return null;
      }

      if (existingLink.status !== LinkStatus.ACTIVE) {
        return null;
      }

      await tx.link.update({
        where: { shortId },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });

      return existingLink.targetUrl;
    });

    if (!result) {
      notFound();
    }

    redirect(result);
  } catch (error) {
    console.error("Error processing redirect:", error);
    notFound();
  }
}
