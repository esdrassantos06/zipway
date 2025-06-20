"use server";
import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { changePasswordSchema } from "@/validation/ChangePasswordSchema";

export async function updatePasswordAction(formData: FormData) {
  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { currentPassword, newPassword } = parsed.data;
  const session = await getSessionFromHeaders(await headers());
  if (!session) throw new Error("Unauthorized");

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: true },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) return { error: err.message };
    return { error: "Internal Server Error" };
  }
}
