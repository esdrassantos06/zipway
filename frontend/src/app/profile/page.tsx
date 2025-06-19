import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSessionFromHeaders } from "@/utils/getSession";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  const FullPostAccess = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        posts: ["update", "delete"],
      },
    },
  });

  return (
    <div>
      <SignOutButton />
      {session.user.role === "ADMIN" && (
        <Button variant={"outline"} asChild>
          <Link href={"/admin/dashboard"}>Admin Area</Link>
        </Button>
      )}
      <h1>Perfil</h1>

      <h2>
        Olá! {session.user.name}, seu cargo atual é de: {session.user.role}
      </h2>

      <h3>Permissions</h3>
      <div className="flex gap-2">
        <Button>Manage own posts</Button>
        <Button disabled={!FullPostAccess.success}>Manage all posts</Button>
      </div>
    </div>
  );
}
