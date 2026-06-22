import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);
    const bolao = await prisma.bolao.findUnique({
      where: { id },
      include: {
        prizeRules: true,
        games: true,
        inscriptions: {
          include: { user: { select: { id: true, name: true } } }
        }
      },
    });

    if (!bolao) {
      return NextResponse.json({ error: "Bolão não encontrado." }, { status: 404 });
    }

    return NextResponse.json(bolao);
  } catch (error) {
    console.error("Erro ao buscar bolão:", error);
    return NextResponse.json({ error: "Erro interno ao buscar bolão." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { id: paramId } = await params;
    const id = Number(paramId);
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
      status
    } = body;

    const updatedBolao = await prisma.bolao.update({
      where: { id },
      data: {
        name,
        quotaValue: quotaValue !== undefined ? Number(quotaValue) : undefined,
        orgFeePercent: orgFeePercent !== undefined ? Number(orgFeePercent) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        pixKey,
        pixQrCodePath,
        exactScorePoints: exactScorePoints !== undefined ? Number(exactScorePoints) : undefined,
        winnerDiffPoints: winnerDiffPoints !== undefined ? Number(winnerDiffPoints) : undefined,
        winnerOnlyPoints: winnerOnlyPoints !== undefined ? Number(winnerOnlyPoints) : undefined,
        wrongPoints: wrongPoints !== undefined ? Number(wrongPoints) : undefined,
        status,
      },
    });

    return NextResponse.json(updatedBolao);
  } catch (error) {
    console.error("Erro ao atualizar bolão:", error);
    return NextResponse.json({ error: "Erro interno ao atualizar bolão." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { id: paramId } = await params;
    const id = Number(paramId);
    await prisma.bolao.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bolão deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar bolão:", error);
    return NextResponse.json({ error: "Erro interno ao deletar bolão." }, { status: 500 });
  }
}
