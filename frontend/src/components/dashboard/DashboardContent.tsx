"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "./StatsCards";
import { LinkForm } from "./LinkForm";
import { LinksTable } from "./LinksTable";
import { toast } from "sonner";
import { AnalyticsTab } from "../AnalyticsTab";

type Link = {
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
}

export function Content({ activeTab }: ContentProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user-links");
        const data = await res.json();
        if (res.ok) {
          setLinks(data.links);
        } else {
          console.error("Failed to fetch links:", data);
          toast.error("Failed to load links");
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        toast.error("Error loading links");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

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
                <LinkForm />
              </div>
              <LinksTable
                links={links}
                setLinks={setLinks}
                isLoading={isLoading}
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
              <LinkForm />
              <LinksTable
                links={links}
                setLinks={setLinks}
                isLoading={isLoading}
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
