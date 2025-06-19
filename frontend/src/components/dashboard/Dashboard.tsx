"use client";
import { Content } from "./DashboardContent";
import { Header } from "./HeaderDashboard";
import Sidebar from "./Sidebar/Sidebar";
import { useState } from "react";


type Link = {
  id: string;
  shortId: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
};

interface DashboardContentProps {
  initialLinks: Link[];
}

export function Dashboard({
  initialLinks,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [links, setLinks] = useState<Link[]>(initialLinks);


  return (
    <div className="bg-background h-screen flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Content activeTab={activeTab} links={links} setLinks={setLinks} />
        </main>
      </div>
    </div>
  );
}
