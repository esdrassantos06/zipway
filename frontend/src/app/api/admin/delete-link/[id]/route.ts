// app/api/admin/delete-link/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { getSessionFromHeaders } from "@/utils/getSession";
import { UserRole } from "@/generated/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Limite de taxa excedido" },
      { status: 429 }
    );
  }

  const session = await getSessionFromHeaders(req.headers);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;

  if (!id || id === "undefined" || id.trim() === "") {
    return NextResponse.json({ error: "ID do link inválido" }, { status: 400 });
  }

  try {
    // Primeiro, tentamos encontrar o link pelo ID
    let link = await prisma.link.findUnique({
      where: { id },
    });

    // Se não encontrar pelo ID, tenta pelo shortId
    if (!link) {
      link = await prisma.link.findUnique({
        where: { shortId: id },
      });
    }

    if (!link) {
      return NextResponse.json(
        { error: "Link não encontrado" },
        { status: 404 }
      );
    }

    // Admin pode deletar qualquer link, então não verificamos o userId
    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    await prisma.link.delete({
      where: whereClause,
    });

    return NextResponse.json({ 
      message: "Link deletado com sucesso",
      id: link.id 
    });
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 });
  }
}