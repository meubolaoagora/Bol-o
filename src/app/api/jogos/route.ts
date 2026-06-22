import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const body = await request.json();
    const { bolaoId, teamA, teamB, matchDate, phase } = body;

    if (!bolaoId || !teamA || !teamB || !matchDate || !phase) {
      return NextResponse.json({ error: "Dados incompletos para criação do jogo." }, { status: 400 });
    }

    const game = await prisma.game.create({
      data: {
        bolaoId: Number(bolaoId),
        teamA,
        teamB,
        matchDate: new Date(matchDate),
        phase,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    return NextResponse.json({ error: "Erro interno ao criar jogo." }, { status: 500 });
  }
}
