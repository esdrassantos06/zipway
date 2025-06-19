import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";
import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  return <Dashboard session={session} />;
}
