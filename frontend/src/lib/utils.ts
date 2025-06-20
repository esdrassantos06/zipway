import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 7);

export function generateShortId(): string {
  return nanoid();
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

  const suspiciousPatterns = [
    /^(admin|root|api|www|mail)$/,
    /^\d+$/,
    /^[_-]+$/,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { isValid: false, error: "This alias pattern is not allowed" };
    }
  }

  return { isValid: true };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const RESERVED_PATHS = [
  "",
  "shorten",
  "stats",
  "docs",
  "ping",
  "login",
  "register",
  "auth",
  "signin",
  "signup",
  "logout",
  "api",
  "_next",
  "_vercel",
  "vercel",
  "favicon",
  "favicon.ico",
  "robots",
  "robots.txt",
  "sitemap",
  "sitemap.xml",
  "home",
  "dashboard",
  "profile",
  "settings",
  "admin",
  "user",
  "account",
  "about",
  "contact",
  "help",
  "support",
  "terms",
  "privacy",
  "policy",
  "public",
  "static",
  "assets",
  "images",
  "img",
  "css",
  "js",
  "fonts",
  "404",
  "500",
  "error",
  "not-found",
  "webhook",
  "webhooks",
  "callback",
  "oauth",
  "health",
  "status",
  "metrics",
  "monitoring",
  "ping",
  "www",
  "mail",
  "email",
  "ftp",
  "blog",
  "news",
  "shop",
  "store",
  "administrator",
  "manage",
  "management",
  "console",
  "download",
  "upload",
  "file",
  "files",
  "media",
];
