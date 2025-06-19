import { getUserIdFromRequest } from "@/utils/getSession";

export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    return new Response(JSON.stringify({ userId: null }), { status: 401 });
  }

  return new Response(JSON.stringify({ userId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
