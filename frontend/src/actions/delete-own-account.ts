"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteOwnAccountAction() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    await auth.api.signOut({ headers: headersList });
    redirect("/auth/login");
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Failed to delete account." };
  }
}
