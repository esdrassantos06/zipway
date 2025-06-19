import { NextResponse } from "next/server";
import { getSessionFromHeaders } from "@/utils/getSession";

export async function GET(req: Request) {
  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  return NextResponse.json({ role: session.user.role });
}
