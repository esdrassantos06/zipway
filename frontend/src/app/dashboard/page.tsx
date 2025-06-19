import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";

import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";
import { getUserLinks } from "@/utils/getUserLinks";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  const links = await getUserLinks(session.user.id);

  return <Dashboard initialLinks={links} />;
}
