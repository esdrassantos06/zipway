"use client";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { SignOutButton } from "./auth/SignOutButton";

const Btn = ({ session }: { session: unknown }) => {
  if (!session) {
    return (
      <>
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/auth/login"}>Login</Link>
        </Button>
        <Button size={"sm"} asChild>
          <Link href={"/auth/register"}>Registrar</Link>
        </Button>
      </>
    );
  } else {
    return (
      <>
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
        <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
          Zipway
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4">
        <Btn session={session} />
      </nav>
    </header>
  );
}
