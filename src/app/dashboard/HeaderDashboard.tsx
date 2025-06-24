import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { SignOutButton } from "../../components/auth/SignOutButton";
import { getInitials } from "@/utils/AppUtils";
import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function Header() {
  const session = await getSessionFromHeaders(await headers());

  if (!session) {
    redirect("auth/login");
  }

  const initials = getInitials(session?.user?.name || "");

  return (
    <header className="bg-background border-b px-6 py-4">
      <div className="flex w-full items-center justify-end">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-8 rounded-full">
                <Avatar className="size-8">
                  <AvatarImage
                    src={
                      session?.user.image ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {session?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {session?.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/profile"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={"/settings"}>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton
                  size="sm"
                  className="flex w-full items-center justify-start !bg-transparent p-0 font-normal !shadow-none"
                  variant="secondary"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
