import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  DEFAULT_LIMITS,
  getClientIdentifier,
} from "@/utils/rateLimiter";
import { getSessionFromHeaders } from "@/utils/getSession";
import { UserRole } from "@/generated/prisma";
import validator from "validator";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Limite de taxa excedido" },
      { status: 429 },
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
    const body = await req.json();
    const { targetUrl, shortId, status } = body;

    // Validações
    if (targetUrl && !validator.isURL(targetUrl, { require_protocol: true })) {
      return NextResponse.json(
        { error: "URL de destino inválida" },
        { status: 400 },
      );
    }

    if (status && !["active", "paused"].includes(status.toLowerCase())) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    if (shortId) {
      const sanitizedShortId = sanitizeAlias(shortId);

      if (isReservedAlias(sanitizedShortId)) {
        return NextResponse.json(
          { error: "Este slug é reservado pelo sistema" },
          { status: 400 },
        );
      }

      const validation = validateAlias(sanitizedShortId);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || "Slug inválido" },
          { status: 400 },
        );
      }

      // Verificar se o shortId já existe (exceto para o link atual)
      const existingLink = await prisma.link.findUnique({
        where: { shortId: sanitizedShortId },
      });

      if (existingLink && existingLink.id !== id) {
        return NextResponse.json(
          { error: "Este slug já está em uso" },
          { status: 400 },
        );
      }
    }

    // Encontrar o link
    let link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      link = await prisma.link.findUnique({
        where: { shortId: id },
      });
    }

    if (!link) {
      return NextResponse.json(
        { error: "Link não encontrado" },
        { status: 404 },
      );
    }

    const updateData: Partial<{
      targetUrl: string;
      shortId: string;
      status: "ACTIVE" | "PAUSED";
    }> = {};

    if (targetUrl) {
      updateData.targetUrl = targetUrl;
    }

    if (shortId) {
      updateData.shortId = sanitizeAlias(shortId);
    }

    if (status) {
      updateData.status = status.toUpperCase() as "ACTIVE" | "PAUSED";
    }

    // Atualizar o link
    const whereClause = link.shortId
      ? { shortId: link.shortId }
      : { id: link.id };

    const updatedLink = await prisma.link.update({
      where: whereClause,
      data: updateData,
    });

    const response = {
      id: updatedLink.id,
      originalUrl: updatedLink.targetUrl,
      shortUrl: `${process.env.NEXT_PUBLIC_URL}/${updatedLink.shortId}`,
      slug: updatedLink.shortId,
      clicks: updatedLink.clicks,
      status: updatedLink.status,
      createdAt: updatedLink.createdAt.toISOString(),
    };

    return NextResponse.json({
      message: "Link atualizado com sucesso",
      link: response,
    });
  } catch (error) {
    console.error("Erro ao editar link:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
