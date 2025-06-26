import { z } from "zod";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";

export const linkFormSchema = z.object({
  targetUrl: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL")
    .refine((val) => val.startsWith("http"), {
      message: "URL must contain the (http/https) protocol",
    }),
  customAlias: z
    .union([z.string().trim(), z.literal("")])
    .transform((val) => sanitizeAlias(val || ""))
    .refine(
      (val) => {
        // Permite aliases vazios (serão gerados automaticamente com nanoid)
        if (!val) return true;
        // Só verifica se é reservado quando há um valor
        return !isReservedAlias(val);
      },
      {
        message: "This alias is reserved by system",
      },
    )
    .refine(
      (val) => {
        if (!val) return true;
        return validateAlias(val).valid;
      },
      {
        message: "Invalid alias",
      },
    ),
});

export type LinkFormSchema = z.infer<typeof linkFormSchema>;
