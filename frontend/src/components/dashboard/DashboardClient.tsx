"use client";

import { useState } from "react";
import { SidebarClient } from "./SidebarClient";
import { Content } from "./DashboardContent";
import { Header } from "./HeaderDashboard";

interface Session {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <SidebarClient activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <Header session={session} />
        <main className="flex-1 overflow-auto">
          <Content activeTab={activeTab} />
        </main>
      </div>
    </>
  );
}
