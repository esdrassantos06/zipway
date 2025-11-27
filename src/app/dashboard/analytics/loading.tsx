import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "@/app/dashboard/HeaderDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AnalyticsLoading() {
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
                  <Skeleton className="mb-2 h-9 w-40" />
                  <Skeleton className="h-5 w-72" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 sm:px-6">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4 rounded" />
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Analytics Chart Skeleton */}
                <Card>
                  <CardHeader className="px-4 sm:px-6">
                    <Skeleton className="mb-2 h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <Skeleton className="h-64 w-full" />
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
