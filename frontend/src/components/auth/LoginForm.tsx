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

// Schema de validação
const loginFormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
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

        // Definir erros específicos baseados na resposta
        if (error.toLowerCase().includes("email")) {
          form.setError("email", { message: error });
        } else if (
          error.toLowerCase().includes("password") ||
          error.toLowerCase().includes("senha")
        ) {
          form.setError("password", { message: error });
        } else {
          // Erro geral - pode ser mostrado no toast ou como erro do form
          form.setError("root", { message: error });
        }
      } else {
        toast.success("Login realizado com sucesso! Bem-vindo de volta!");
        router.push("/profile");
        window.location.reload();
      }
    } catch {
      toast.error("Erro interno. Tente novamente.");
      form.setError("root", { message: "Erro interno. Tente novamente." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
              <span className="text-muted-foreground px-2">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Login com Email */}
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
                        placeholder="seu@email.com"
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
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Exibir erro geral do formulário */}
              {form.formState.errors.root && (
                <div className="text-center text-sm text-red-600">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? (
                  <>
                    <Loader size={12} className="mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-4" />
                    Entrar com Email
                  </>
                )}
              </Button>
            </form>
          </Form>

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
