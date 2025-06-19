"use client";

import {
  BarChart3,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "links",
    label: "My Links",
    icon: LayoutDashboard,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (data.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Erro ao buscar sessão", err);
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="bg-background relative w-64 border-r">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center justify-center">
            <Link2 className="size-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
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

        <Link href="/settings">
          <Button variant={"ghost"} className="w-full justify-start">
            <Settings className="mr-2 size-4" />
            Settings
          </Button>
        </Link>

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
