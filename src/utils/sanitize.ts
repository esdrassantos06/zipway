export const sanitizeAlias = (alias: string): string => {
  if (!alias) return "";

  const sanitized = alias
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/[-_]{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  return sanitized.substring(0, 50);
};

export const validateAlias = (
  alias: string,
): { valid: boolean; error?: string } => {
  const sanitized = sanitizeAlias(alias);

  if (!sanitized) return { valid: false, error: "Alias ​​cannot be empty" };
  if (sanitized.length < 2)
    return {
      valid: false,
      error: "Alias ​​must be at least 2 characters long",
    };
  if (/^\d+$/.test(sanitized))
    return { valid: false, error: "Alias ​​cannot be just numbers" };
  const forbiddenPatterns = [/^(admin|root|api|www|mail)$/i, /^[_-]+$/];

  if (forbiddenPatterns.some((pattern) => pattern.test(sanitized))) {
    return { valid: false, error: "Alias ​​pattern not allowed" };
  }

  return { valid: true };
};

export const reservedPaths = [
  "",
  "shorten",
  "stats",
  "docs",
  "ping",
  "login",
  "register",
  "auth",
  "forgot-password",
  "reset-password",
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
  "pt",
  "en",
  "es",
  "fr",
  "de",
];

export const isReservedAlias = (alias: string): boolean => {
  return reservedPaths.includes(alias.toLowerCase());
};
