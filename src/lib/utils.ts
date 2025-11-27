import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeAlias(alias: string): string {
  if (!alias) return "";

  alias = alias.trim();

  alias = alias.toLowerCase();

  alias = alias.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  alias = alias.replace(/[^a-zA-Z0-9\-_]/g, "");

  alias = alias.replace(/[-_]{2,}/g, "-");

  alias = alias.replace(/^[-_]+|[-_]+$/g, "");

  alias = alias.substring(0, 50);

  return alias;
}

export function validateAlias(alias: string): {
  isValid: boolean;
  error?: string;
} {
  const sanitized = sanitizeAlias(alias);

  if (!sanitized) {
    return {
      isValid: false,
      error: "Alias cannot be empty after sanitization",
    };
  }

  if (sanitized.length < 2) {
    return { isValid: false, error: "Alias must have at least 2 characters" };
  }

  if (/^\d+$/.test(sanitized)) {
    return { isValid: false, error: "Alias cannot be only numbers" };
  }

  return { isValid: true };
}
