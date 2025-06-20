"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { resetPasswordSchema } from "@/validation/ResetPasswordSchema";

export async function ResetPasswordAction(formData: FormData) {
  const raw = {
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
    token: formData.get("token"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const err = parsed.error.errors[0].message;
    return { error: err };
  }

  const { newPassword } = parsed.data;
  const token = String(raw.token || "");

  if (!token) return { error: "Token not provided." };

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: { newPassword, token },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }
    return { error: "Internal Server Error." };
  }
}
