"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";

import { updatePasswordAction } from "@/actions/update-password-action";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Senha atual é obrigatória" }),
    newPassword: z
      .string()
      .min(8, { message: "A nova senha deve ter pelo menos 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/, {
        message:
          "A nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof changePasswordSchema>;

export const SecuritySettings = () => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", data.currentPassword);
      formData.append("newPassword", data.newPassword);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await updatePasswordAction(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Senha alterada com sucesso!");
        reset();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5 text-blue-600" />
          Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={isPending}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              disabled={isPending}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isPending}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
