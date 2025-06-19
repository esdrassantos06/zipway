import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";

export async function GET(req: NextRequest) {
  const session = await getSessionFromHeaders(req.headers)

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        shortId: true,
        targetUrl: true,
        clicks: true,
        createdAt: true,
        status: true, // <== AQUI!
      },
    });

    const mapped = links.map((link) => ({
      id: link.id,
      originalUrl: link.targetUrl,
      shortUrl: `${process.env.NEXT_PUBLIC_URL}/${link.shortId}`,
      clicks: link.clicks,
      status: link.status.toLowerCase(), // "active" | "paused"
      createdAt: link.createdAt.toISOString(),
    }));

    return NextResponse.json({ links: mapped });
  } catch (error) {
    console.error("Erro ao buscar links:", error);
    return NextResponse.json(
      { error: "Erro ao buscar links" },
      { status: 500 },
    );
  }
}
