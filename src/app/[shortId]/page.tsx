import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LinkStatus } from "@/generated/prisma";
import {
  getCachedRedirect,
  cacheRedirect,
  incrementClicksAsync,
} from "@/utils/urlCache";

export default async function Page({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  const resolvedParams = await params;
  const shortId = resolvedParams.shortId;

  try {
    const cached = await getCachedRedirect(shortId);

    if (cached) {
      if (cached.status === LinkStatus.ACTIVE) {
        incrementClicksAsync(shortId);
        redirect(cached.targetUrl);
      } else {
        notFound();
      }
    }

    const existingLink = await prisma.link.findUnique({
      where: { shortId },
      select: {
        targetUrl: true,
        status: true,
      },
    });

    if (!existingLink || existingLink.status !== LinkStatus.ACTIVE) {
      notFound();
    }

    cacheRedirect(shortId, existingLink.targetUrl, existingLink.status);
    incrementClicksAsync(shortId);

    redirect(existingLink.targetUrl);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      (error.digest.startsWith("NEXT_REDIRECT") ||
        error.digest.startsWith("NEXT_NOT_FOUND"))
    ) {
      throw error;
    }

    console.error("Error processing redirect:", error);
    notFound();
  }
}
