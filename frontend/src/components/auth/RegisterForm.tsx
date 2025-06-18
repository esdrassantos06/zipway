"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthButtons from "./AuthButtons";
import ReturnButton from "../ReturnButton";
import { SignUpEmailActions } from "@/actions/sign-up-email-actions";

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);
    const { error } = await SignUpEmailActions(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("User Registered Successfuly");
      router.push("/");
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
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Crie sua conta para começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Registro Social */}
          <AuthButtons signUp provider="github" />
          <AuthButtons signUp provider="google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground bg-white px-2">
                Ou registre-se com
              </span>
            </div>
          </div>

          {/* Registro com Email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="w-full space-y-2">
              <Label htmlFor="Name">Nome</Label>
              <Input id="Name" name="name" placeholder="João Silva" />
            </div>
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
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="acceptTerms" />
              <Label htmlFor="terms" className="text-sm">
                Aceito os{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  termos de uso
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  política de privacidade
                </Link>
              </Label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader size={12} className="animate-spin" /> Loading...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
