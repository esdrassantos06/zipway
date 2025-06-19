"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <Header session={session} />
        <main className="flex-1 overflow-auto">
          <Content activeTab={activeTab} />
        </main>
      </div>
    </>
  );
}
