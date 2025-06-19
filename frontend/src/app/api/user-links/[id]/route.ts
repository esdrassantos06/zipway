import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { shortId } = await params;

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

    await prisma.link.delete({
      where: { id: shortId },
    });

    return NextResponse.json({ message: "Link deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
