import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";
import { getUserLinks } from "@/utils/getUserLinks";
import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "@/app/dashboard/HeaderDashboard";
import { AnalyticsTab } from "@/components/AnalyticsTab";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default async function AnalyticsPage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  const links = await getUserLinks(session.user.id);

  return (
    <div className="bg-background flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="bg-muted/40 flex-1 overflow-x-hidden overflow-y-auto p-6">
              <div className="mx-auto max-w-7xl space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Track the performance of your links
                  </p>
                </div>
                <StatsCards links={links} />
                <AnalyticsTab links={links} />
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
