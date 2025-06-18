import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Ops! Page not found.</p>
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go back to home page.
        </Button>
      </Link>
    </div>
  );
}
