"use client";

import { Sidebar } from "./Sidebar";

interface SidebarClientProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SidebarClient({ activeTab, onTabChange }: SidebarClientProps) {
  return <Sidebar activeTab={activeTab} setActiveTab={onTabChange} />;
}
