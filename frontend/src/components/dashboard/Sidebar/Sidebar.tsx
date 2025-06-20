"use client";

import {
  BarChart3,
  LayoutDashboard,
  HelpCircle,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarClientProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "links", label: "My Links", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarClientProps) {
    const { data: session, isPending } = authClient.useSession();

    if (isPending)
      return (
        <div className="bg-background relative w-64 border-r p-6 space-y-4">
          <Skeleton className="h-8 w-32 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="absolute right-4 bottom-4 left-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      );
    


    const isAdmin = session?.user.role === "ADMIN";


  return (
    <div className="bg-background relative w-64 border-r">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center justify-center">
            <Link2 className="size-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold dark:text-white text-gray-900">
              Zipway
            </span>
          </Link>
        </div>
      </div>
      <nav className="space-y-2 px-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === item.id && "bg-secondary",
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="mr-2 size-4" />
            {item.label}
          </Button>
        ))}

        {isAdmin && (
          <Link href="/admin/dashboard">
            <Button variant="destructive" className="mt-2 w-full justify-start">
              <ShieldCheck className="mr-2 size-4" />
              Admin
            </Button>
          </Link>
        )}
      </nav>
      <div className="absolute right-4 bottom-4 left-4">
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 size-4" />
          Help and Support
        </Button>
      </div>
    </div>
  );
}
