"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export const SignOutButton = () => {
  const router = useRouter();

  async function handleClick() {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  }
  return (
    <Button onClick={handleClick} size={"sm"} variant={"destructive"}>
      Sign Out
    </Button>
  );
};
