import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";
import { getUserLinks } from "@/utils/getUserLinks";
import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "@/app/dashboard/HeaderDashboard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { LinkForm } from "@/components/dashboard/LinkForm";
import { LinksTable } from "@/components/dashboard/LinksTable";

export default async function DashboardPage() {
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
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your shortened links and track statistics
                  </p>
                </div>
                <StatsCards links={links} />
                <div className="flex w-full">
                  <LinkForm />
                </div>
                <LinksTable
                  links={links}
                  isLoading={false}
                  userId={session.user.id}
                  limit={5}
                />
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
