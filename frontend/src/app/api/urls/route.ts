import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId é obrigatório" },
      { status: 400 },
    );
  }

  const count = await prisma.link.count({
    where: { userId },
  });

  return NextResponse.json({ count });
}
