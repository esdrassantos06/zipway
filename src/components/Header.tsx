"use client";
import { Link2, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { SignOutButton } from "./auth/SignOutButton";
import { useState } from "react";

const Btn = ({ session }: { session: unknown }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!session) {
    return (
      <>
        {/* Desktop buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/auth/login"}>Login</Link>
          </Button>
          <Button size={"sm"} asChild>
            <Link href={"/auth/register"}>Register</Link>
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-1 md:hidden">
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/auth/login"}>Login</Link>
          </Button>
          <Button size={"sm"} asChild>
            <Link href={"/auth/register"}>Register</Link>
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Button size={"sm"} variant="link" asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button size={"sm"} variant="link" asChild>
            <Link href={"/profile"}>Profile</Link>
          </Button>
          <Button size={"sm"} variant="link" asChild>
            <Link href={"/settings"}>Settings</Link>
          </Button>
          <SignOutButton />
        </div>

        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>

            {/* Dropdown menu with animations */}
            <div
              className={`absolute top-full right-0 z-50 mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-zinc-50 shadow-lg transition-all duration-300 ease-out dark:border-gray-700 dark:bg-zinc-950 ${
                isMenuOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-2 scale-95 opacity-0"
              }`}
            >
              <div className="py-1">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <div className="px-4 py-2">
                  <div onClick={() => setIsMenuOpen(false)}>
                    <SignOutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-16 items-center border-b px-4 lg:px-6">
      <Link href="/" className="flex items-center justify-center">
        <Link2 className="size-8 text-blue-600" />
        <span className="ml-2 hidden text-xl font-bold text-gray-900 sm:block md:text-2xl dark:text-white">
          Zipway
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4">
        <Btn session={session} />
      </nav>
    </header>
  );
}
