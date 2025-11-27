"use server";

import { auth } from "@/lib/auth";
import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";

export async function deleteOwnAccountAction() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  try {
    await auth.api.deleteUser({ headers: headersList, body: {} });
    return { success: true };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Failed to delete account." };
  }
}
