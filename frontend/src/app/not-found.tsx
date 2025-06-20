import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold  dark:text-white text-gray-900">404</h1>
      <p className="mb-6 text-xl dark:text-gray-300 text-gray-600">Ops! Page not found.</p>
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Go back to home page.
        </Button>
      </Link>
    </div>
  );
}
