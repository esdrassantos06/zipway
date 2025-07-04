"use server";

import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  if (session.user.role !== UserRole.ADMIN || session.user.id === userId) {
    throw new Error("Forbidden");
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: "USER",
      },
    });

    if (session.user.id === userId) {
      await auth.api.signOut({
        headers: headersList,
      });
      redirect("/auth/login");
    }

    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Internal Server Error" };
  }
}
