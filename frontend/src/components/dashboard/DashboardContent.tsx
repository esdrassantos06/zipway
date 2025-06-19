"use client";

import { StatsCards } from "./StatsCards";
import { LinkForm } from "./LinkForm";
import { LinksTable } from "./LinksTable";

interface ContentProps {
  activeTab: string;
}

export function Content({ activeTab }: ContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <main className="bg-muted/40 flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {activeTab === "overview" && (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your shortened links and track statistics
                </p>
              </div>
              <StatsCards />
              <div className="flex w-full">
                <LinkForm />
              </div>
              <LinksTable />
            </>
          )}
          {activeTab === "links" && (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Links</h1>
                <p className="text-muted-foreground">
                  View and manage all your shortened links
                </p>
              </div>
              <LinkForm />
              <LinksTable />
            </>
          )}
          {activeTab === "analytics" && (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                  Track the performance of your links
                </p>
              </div>
              <StatsCards />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
