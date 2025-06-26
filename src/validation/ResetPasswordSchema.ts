import z from "zod";

const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(8, "Minimum 8 characters").regex(pwdRegex, {
      message:
        "Must contain uppercase, lowercase, number and special character",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
