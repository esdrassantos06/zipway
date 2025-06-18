"use client";

import type React from "react";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader, Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthButtons from "./AuthButtons";
import ReturnButton from "../ReturnButton";
import { useState } from "react";
import { SignInEmailActions } from "@/actions/sign-in-email-actions";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);
    const { error } = await SignInEmailActions(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Login Successful. Good to have you back!");
      router.push("/profile");
      window.location.reload();
    }

    setIsPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <ReturnButton href="/" label="Voltar" />
          <CardTitle className="text-center text-2xl font-bold">
            Entrar
          </CardTitle>
          <CardDescription className="text-center">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login Social */}
          <AuthButtons provider="github" />
          <AuthButtons provider="google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground bg-white px-2">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Login com Email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <>
                  <Loader size={12} className="animate-spin" /> Loading...
                </>
              ) : (
                <>
                  {" "}
                  <Mail className="mr-2 h-4 w-4" />
                  Entrar com Email
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
