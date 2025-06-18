"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { signUpSchema } from "@/validation/SignUpSchema";

export async function SignUpEmailActions(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: formData.get("acceptTerms"),
  };

  const parsed = signUpSchema.safeParse(rawData);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { error: firstError.message };
  }

  const { name, email, password } = parsed.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";
      switch (errCode) {
        default:
          return { error: err.message };
      }
    }
  }

  return { error: "An unexpected error occurred. Please try again." };
}
