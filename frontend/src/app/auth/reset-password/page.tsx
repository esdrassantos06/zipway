import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) redirect("/");

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: { newPassword: "__dummy__", token },
    });
  } catch (err) {
    if (err instanceof APIError) {
      return redirect("/?error=invalid_token");
    }
    return redirect("/?error=internal_error");
  }

  return <ResetPasswordForm token={token} />;
}
