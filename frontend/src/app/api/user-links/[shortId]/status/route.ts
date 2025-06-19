import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { shortId } = await params;

  if (!shortId || shortId === "undefined" || shortId.trim() === "") {
    return NextResponse.json({ error: "ID do link inválido" }, { status: 400 });
  }

  const { status } = await req.json();
  if (!["ACTIVE", "PAUSED"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  try {
    let link = await prisma.link.findUnique({
      where: { shortId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!link) {
      link = await prisma.link.findUnique({
        where: { id: shortId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    if (!link) {
      return NextResponse.json(
        { error: "Link não encontrado" },
        { status: 404 },
      );
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Update using the correct identifier (shortId if it exists, otherwise id)
    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    const updated = await prisma.link.update({
      where: whereClause,
      data: { status: status.toUpperCase() as "ACTIVE" | "PAUSED" },
    });

    return NextResponse.json({
      message: "Status atualizado",
      status: updated.status.toLowerCase(),
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
