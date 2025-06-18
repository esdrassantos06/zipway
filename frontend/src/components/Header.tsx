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
    return <SignOutButton />;
  }
};

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-16 items-center border-b px-4 lg:px-6">
      <Link href="/" className="flex items-center justify-center">
        <Link2 className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-2xl font-bold text-gray-900">Zipway</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          href="#features"
          className="text-sm font-medium transition-colors hover:text-blue-600"
        >
          Recursos
        </Link>
        <Btn session={session} />
      </nav>
    </header>
  );
}
