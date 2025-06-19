import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/utils/redis";

export async function GET() {
    try {
      await prisma.user.findFirst()
  
      const pong = await redis.ping()
  
      return NextResponse.json({
        database: 'OK',
        redis: pong === 'PONG' ? 'OK' : 'FAIL',
      })
    } catch (error) {
      return NextResponse.json(
        {
          database: 'FAIL',
          redis: 'FAIL',
          error: (error as Error).message,
        },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }