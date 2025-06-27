"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthButtons from "./AuthButtons";
import ReturnButton from "../ReturnButton";
import { useState } from "react";
import { SignInEmailActions } from "@/actions/sign-in-email-actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const { error } = await SignInEmailActions(formData);

      if (error) {
        toast.error(error);

        if (error.toLowerCase().includes("email")) {
          form.setError("email", { message: error });
        } else if (error.toLowerCase().includes("password")) {
          form.setError("password", { message: error });
        } else {
          form.setError("root", { message: error });
        }
      } else {
        toast.success("Login successful! Welcome back!");
        router.push("/profile");
        window.location.reload();
      }
    } catch {
      toast.error("Internal Server Error. Try again later.");
      form.setError("root", {
        message: "Internal Server Error. Try again later.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <ReturnButton href="/" label="Go back" />
          <CardTitle className="text-center text-2xl font-bold">
            Log in
          </CardTitle>
          <CardDescription className="text-center">
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthButtons provider="github" />
          <AuthButtons provider="google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        disabled={isPending}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {form.formState.errors.root && (
                <div className="text-center text-sm text-red-600">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? (
                  <>
                    <Loader size={12} className="mr-2 animate-spin" />
                    Loging in...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-4" />
                    Login with Email
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
