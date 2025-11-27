import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "@/app/dashboard/HeaderDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LinksLoading() {
  return (
    <div className="bg-background flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ml-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="bg-muted/40 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
                {/* Header Skeleton */}
                <div className="pt-8 lg:pt-0">
                  <Skeleton className="mb-2 h-9 w-32" />
                  <Skeleton className="h-5 w-80" />
                </div>

                {/* Link Form Skeleton */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <Skeleton className="mb-4 h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>

                {/* Links Table Skeleton */}
                <Card>
                  <CardHeader className="px-4 sm:px-6">
                    <Skeleton className="mb-2 h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <Skeleton className="mb-4 h-10 w-full" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
