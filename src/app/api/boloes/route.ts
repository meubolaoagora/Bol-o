import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const boloes = await prisma.bolao.findMany({
      include: {
        _count: {
          select: { inscriptions: true, games: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(boloes);
  } catch (error) {
    console.error("Erro ao listar bolões:", error);
    return NextResponse.json({ error: "Erro interno ao listar bolões." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      quotaValue,
      orgFeePercent,
      registrationDeadline,
      pixKey,
      pixQrCodePath,
      exactScorePoints,
      winnerDiffPoints,
      winnerOnlyPoints,
      wrongPoints,
      prizeRules
    } = body;

    const newBolao = await prisma.bolao.create({
      data: {
        name,
        quotaValue: Number(quotaValue),
        orgFeePercent: Number(orgFeePercent),
        registrationDeadline: new Date(registrationDeadline),
        pixKey,
        pixQrCodePath,
        exactScorePoints: exactScorePoints ? Number(exactScorePoints) : undefined,
        winnerDiffPoints: winnerDiffPoints ? Number(winnerDiffPoints) : undefined,
        winnerOnlyPoints: winnerOnlyPoints ? Number(winnerOnlyPoints) : undefined,
        wrongPoints: wrongPoints ? Number(wrongPoints) : undefined,
        prizeRules: prizeRules && prizeRules.length > 0 ? {
          create: prizeRules.map((r: any) => ({
            position: Number(r.position),
            percentage: Number(r.percentage),
          }))
        } : undefined
      },
      include: { prizeRules: true },
    });

    return NextResponse.json(newBolao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar bolão:", error);
    return NextResponse.json({ error: "Erro interno ao criar bolão." }, { status: 500 });
  }
}
