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

  const existingLink = await prisma.link.findUnique({
    where: { shortId },
  });

  if (!existingLink) {
    notFound();
  }

  if (existingLink.status !== LinkStatus.ACTIVE) {
    notFound();
  }

  await prisma.link.update({
    where: { shortId },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  redirect(existingLink.targetUrl);
}
