"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type ButtonProps = {
  size?: "sm" | "default" | "icon" | "lg";
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
  className?: string;
};

type SignOutButtonProps = Partial<
  Pick<ButtonProps, "size" | "variant" | "className">
>;
export const SignOutButton = ({
  size = "sm",
  variant = "destructive",
  className,
}: SignOutButtonProps) => {
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
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      className={className}
    >
      Sign Out
    </Button>
  );
};
