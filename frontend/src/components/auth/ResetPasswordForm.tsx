"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordAction } from "@/actions/reset-password";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import ReturnButton from "@/components/ReturnButton";
import { useEffect, useState } from "react";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const form = useForm<FormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.set("newPassword", data.newPassword);
    formData.set("confirmPassword", data.confirmPassword);
    formData.set("token", token);

    const res = await ResetPasswordAction(formData);
    if (res.error) {
      toast.error(res.error);
      setSuccess(false);
    } else {
      toast.success("Password updated successfully!");
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Reset</CardTitle>
            <CardDescription>
              Your password has been updated successfully!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <ReturnButton href="/auth/login" label="Back to sign in" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>{errors.newPassword?.message}</FormMessage>
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="mt-4 flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
              <ReturnButton href="/auth/login" label="Back to sign in" />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
