import Link from "next/link";
import { Button } from "./ui/button";

interface ReturnButtonProps {
  href: string;
  label: string;
}

export default function ReturnButton({ href, label }: ReturnButtonProps) {
  return (
    <Button asChild size={"sm"} className="w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
