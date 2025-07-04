"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { signInSchema } from "@/validation/SignInSchema";

export async function SignInEmailActions(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(rawData);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { error: firstError.message };
  }

  const { email, password } = parsed.data;

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }
  }

  return { error: "Internal Server Error" };
}
