"use client";
import { Dispatch, SetStateAction } from "react";
import { StatsCards } from "./StatsCards";
import { LinkForm } from "./LinkForm";
import { LinksTable } from "./LinksTable";
import { AnalyticsTab } from "../AnalyticsTab";

type LinkType = {
  id: string;
  shortId: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
};

interface ContentProps {
  activeTab: string;
  links: LinkType[];
  setLinks: Dispatch<SetStateAction<LinkType[]>>;
}

export function Content({ activeTab, links, setLinks }: ContentProps) {

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
              <StatsCards links={links} />
              <div className="flex w-full">
                <LinkForm
                  onLinkCreated={(newLink) =>
                    setLinks((prev) => [newLink, ...prev])
                  }
                />
              </div>
              <LinksTable
                links={links}
                setLinks={setLinks}
                isLoading={false}
                limit={5}
              />
            </>
          )}
          {activeTab === "links" && (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Links</h1>
                <p className="text-muted-foreground">
                  View and manage all your recent shortened links
                </p>
              </div>
              <LinkForm onLinkCreated={(newLink) => setLinks(prev => [newLink, ...prev])} />
              <LinksTable
                links={links}
                setLinks={setLinks}
                isLoading={false}
              />
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
              <StatsCards links={links} />
              <AnalyticsTab links={links} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
