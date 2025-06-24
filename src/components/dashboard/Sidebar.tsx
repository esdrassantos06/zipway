"use client";

import { BarChart3, LayoutDashboard, Link2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "My Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  if (isPending)
    return (
      <div className="bg-background relative w-64 space-y-4 border-r p-6">
        <Skeleton className="h-8 w-32 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
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
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              Zipway
            </span>
          </Link>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary",
                )}
              >
                <item.icon className="mr-2 size-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        {isAdmin && (
          <Link href="/admin/dashboard">
            <Button variant="destructive" className="mt-1 w-full justify-start">
              <ShieldCheck className="mr-2 size-4" />
              Admin
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}
