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

  const { status } = await req.json(); // "active" or "paused"

  if (!["active", "paused"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { id: shortId },
    });

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Link não encontrado ou acesso negado" },
        { status: 404 },
      );
    }

    const updated = await prisma.link.update({
      where: { id: shortId },
      data: { status: status.toUpperCase() },
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
