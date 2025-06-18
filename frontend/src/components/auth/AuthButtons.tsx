"use client";

import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export default function AuthButtons({
  provider,
  signUp,
}: SignInOauthButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

    setIsPending(false);
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "Github";

  return (
    <div className="space-y-3">
      <Button
        variant={"outline"}
        className="w-full"
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? (
          <>
            <Loader size={12} className="animate-spin" /> Loading
          </>
        ) : (
          <>
            {provider === "github" ? (
              <>
                <Icon icon={"mdi:github"} className="w-3" />
              </>
            ) : (
              <>
                <Icon icon={"devicon:google"} className="w-3" />
              </>
            )}
            Sign {action} with {providerName}
          </>
        )}
      </Button>
    </div>
  );
}
