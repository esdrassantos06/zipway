import { z } from "zod";

const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" })
      .regex(pwdRegex, {
        message:
          "Must contain uppercase, lowercase, number and special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });
