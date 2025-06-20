import { z } from "zod";

const pwdRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Senha atual é obrigatória" }),
    newPassword: z
      .string()
      .min(8, { message: "A nova senha deve ter pelo menos 8 caracteres" })
      .regex(pwdRegex, {
        message:
          "Deve conter maiúscula, minúscula, número e caractere especial",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });
