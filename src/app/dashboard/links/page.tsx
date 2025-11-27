import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionFromHeaders } from "@/utils/getSession";
import { LinksTable } from "@/components/dashboard/LinksTable";
import { Header } from "../HeaderDashboard";
import Sidebar from "@/components/dashboard/Sidebar";
import { getUserLinksPage } from "@/utils/getUserLinks";

type LinksPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function LinksPage({ searchParams }: LinksPageProps) {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || "1", 10);
  const pageSize = 10;
  const { links, total, page, totalPages } = await getUserLinksPage(
    session.user.id,
    currentPage,
    pageSize,
  );

  return (
    <div className="bg-background flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ml-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="bg-muted/40 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
                <div className="pt-8 lg:pt-0">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    My Links
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    View and manage all your recent shortened links
                  </p>
                </div>
                <LinksTable
                  links={links}
                  isLoading={false}
                  userId={session.user.id}
                  total={total}
                  page={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                />
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
