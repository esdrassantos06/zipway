/**
 * API Client for Go Backend
 * Uses Next.js API routes as proxy to forward requests with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shly.pt";

/**
 * Create a shortened URL
 * Calls local Next.js proxy endpoint which forwards to Go API with cookies
 */
export async function createShortLink(
  targetUrl: string,
  customSlug?: string,
): Promise<{ short_url: string; details: any }> {
  const response = await fetch("/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      targetUrl,
      custom_id: customSlug,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Resolve a slug to target URL
 * Note: This is used server-side only, no CORS issues
 */
export async function resolveSlug(slug: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/resolve/${slug}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Link not found");
  }

  const data = await response.json();
  return data.target_url;
}
