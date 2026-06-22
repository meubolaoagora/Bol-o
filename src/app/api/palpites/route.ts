import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Você precisa estar logado." }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, predictedScoreA, predictedScoreB } = body;

    if (!gameId || predictedScoreA === undefined || predictedScoreB === undefined) {
      return NextResponse.json({ error: "Dados incompletos para o palpite." }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: Number(gameId) },
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
    }

    // Check if the game has already started
    if (new Date() >= new Date(game.matchDate)) {
      return NextResponse.json({ error: "Não é possível enviar palpites para um jogo que já começou ou já foi finalizado." }, { status: 400 });
    }

    // Upsert the prediction (create if it doesn't exist, update if it does)
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_gameId: {
          userId: Number(session.user.id),
          gameId: Number(gameId),
        },
      },
      update: {
        predictedScoreA: Number(predictedScoreA),
        predictedScoreB: Number(predictedScoreB),
      },
      create: {
        userId: Number(session.user.id),
        gameId: Number(gameId),
        predictedScoreA: Number(predictedScoreA),
        predictedScoreB: Number(predictedScoreB),
      },
    });

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Erro ao salvar palpite:", error);
    return NextResponse.json({ error: "Erro interno ao salvar palpite." }, { status: 500 });
  }
}
