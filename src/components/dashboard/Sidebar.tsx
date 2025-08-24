"use client";

import {
  BarChart3,
  LayoutDashboard,
  Link2,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "My Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isPending)
    return (
      <div className="bg-background relative w-16 space-y-4 border-r p-6 lg:w-64">
        <div className="flex items-center justify-center lg:justify-start">
          <Skeleton className="h-8 w-8 rounded-md lg:w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-2 left-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background border shadow-sm"
        >
          {isMobileMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-background relative border-r transition-transform duration-300 ease-in-out",
          "lg:w-64 lg:translate-x-0",
          isMobileMenuOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0"
            : "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full lg:relative lg:translate-x-0",
        )}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link2 className="size-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
                Zipway
              </span>
            </Link>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full items-center justify-start",
                    isActive && "bg-secondary",
                  )}
                >
                  <item.icon className="mr-2 size-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant="destructive"
                className="mt-1 w-full items-center justify-start"
              >
                <ShieldCheck className="mr-2 size-4" />
                <span>Admin</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
