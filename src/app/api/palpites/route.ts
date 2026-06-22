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
    let predictionsArray = [];

    // Check if it's an array of predictions or a single one
    if (Array.isArray(body)) {
      predictionsArray = body;
    } else {
      predictionsArray = [body];
    }

    if (predictionsArray.length === 0) {
      return NextResponse.json({ error: "Nenhum palpite enviado." }, { status: 400 });
    }

    const results = [];

    for (const p of predictionsArray) {
      const { gameId, predictedScoreA, predictedScoreB } = p;

      if (!gameId || predictedScoreA === undefined || predictedScoreB === undefined) {
        continue; // Skip invalid
      }

      const game = await prisma.game.findUnique({
        where: { id: Number(gameId) },
      });

      if (!game) continue;

      // Check if the game has already started
      if (new Date() >= new Date(game.matchDate)) {
        continue; // Skip games that already started
      }

      // Upsert the prediction
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
      
      results.push(prediction);
    }

    return NextResponse.json({ success: true, saved: results.length });
  } catch (error) {
    console.error("Erro ao salvar palpite:", error);
    return NextResponse.json({ error: "Erro interno ao salvar palpite." }, { status: 500 });
  }
}
