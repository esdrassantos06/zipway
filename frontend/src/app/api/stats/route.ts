import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRateLimiter, DEFAULT_LIMITS, getClientIdentifier } from '@/utils/rateLimiter';

export async function GET(req: NextRequest) {
  const rateLimiter = createRateLimiter(DEFAULT_LIMITS.admin);
  const identifier = getClientIdentifier(req);
  const isAllowed = await rateLimiter(identifier);
  
  if (!isAllowed) {
    return NextResponse.json({ error: 'Limite de taxa excedido' }, { status: 429 });
  }

  const token = req.headers.get('authorization')?.split(' ')[1];
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    return NextResponse.json({ error: 'Token de admin não configurado' }, { status: 500 });
  }

  if (token !== adminToken) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
  
  const urls = await prisma.link.findMany({
    take: limit,
    orderBy: { clicks: 'desc' },
  });

  return NextResponse.json({
    top_urls: urls,
    total: urls.length,
  });
}