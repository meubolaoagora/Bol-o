import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recalculateAllScores } from "@/lib/scoring";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { id: paramId } = await params;
    const id = Number(paramId);
    const body = await request.json();
    const { scoreA, scoreB, status } = body;

    if (scoreA === undefined || scoreB === undefined) {
      return NextResponse.json({ error: "Os placares são obrigatórios." }, { status: 400 });
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        status: status || "FINISHED",
      },
    });

    // Recalculate scores for all predictions for this game
    await recalculateAllScores(game.id);

    return NextResponse.json({ message: "Resultado atualizado e pontuações recalculadas.", game });
  } catch (error) {
    console.error("Erro ao atualizar resultado do jogo:", error);
    return NextResponse.json({ error: "Erro interno ao atualizar resultado." }, { status: 500 });
  }
}
