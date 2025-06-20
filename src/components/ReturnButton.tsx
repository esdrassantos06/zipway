import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface ReturnButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function ReturnButton({
  href,
  label,
  className,
}: ReturnButtonProps) {
  return (
    <Link href={href} className={`w-full ${className}`}>
      <Button size={"sm"} variant={"ghost"} className="w-full">
        <ArrowLeft size={20} />
        {label}
      </Button>
    </Link>
  );
}
