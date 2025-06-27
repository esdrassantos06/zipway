"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthButtons from "./AuthButtons";
import ReturnButton from "../ReturnButton";
import { SignUpEmailActions } from "@/actions/sign-up-email-actions";
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

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Name must contain only letters and spaces"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter and one number",
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms of use",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("acceptTerms", data.acceptTerms ? "true" : "false");

      const { error } = await SignUpEmailActions(formData);

      if (error) {
        toast.error(error);

        if (error.toLowerCase().includes("email")) {
          form.setError("email", { message: error });
        } else if (error.toLowerCase().includes("name")) {
          form.setError("name", { message: error });
        } else if (error.toLowerCase().includes("password")) {
          form.setError("password", { message: error });
        } else {
          form.setError("root", { message: error });
        }
      } else {
        toast.success("User registered successfully!");
        router.push("/");
        window.location.reload();
      }
    } catch {
      toast.error("Internal Server Error.Try again later.");
      form.setError("root", {
        message: "Internal Server Error.Try again later.",
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
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Buttons */}
          <AuthButtons signUp provider="github" />
          <AuthButtons signUp provider="google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground px-2">
                Or register with
              </span>
            </div>
          </div>

          {/* Registro com Email */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground text-xs">
                      Minimum 8 characters, including uppercase, lowercase and
                      number
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            field.onChange(checked);
                          } else {
                            field.onChange(false);
                          }
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I accept the
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Use
                        </Link>{" "}
                        and
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-center text-sm text-red-600">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader size={12} className="mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
