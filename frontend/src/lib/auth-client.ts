import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

const URL = process.env.NEXT_PUBLIC_URL as string;

export const authClient = createAuthClient({
  baseURL: URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export type Session = typeof authClient.$Infer.Session;
