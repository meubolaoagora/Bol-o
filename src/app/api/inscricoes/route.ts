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
    const { bolaoId } = body;

    if (!bolaoId) {
      return NextResponse.json({ error: "ID do bolão é obrigatório." }, { status: 400 });
    }

    const bolao = await prisma.bolao.findUnique({
      where: { id: Number(bolaoId) },
    });

    if (!bolao) {
      return NextResponse.json({ error: "Bolão não encontrado." }, { status: 404 });
    }

    if (new Date() > new Date(bolao.registrationDeadline) || bolao.status !== "OPEN") {
      return NextResponse.json({ error: "Inscrições encerradas para este bolão." }, { status: 400 });
    }

    const existingInscription = await prisma.inscription.findFirst({
      where: {
        userId: Number(session.user.id),
        bolaoId: Number(bolaoId),
      },
    });

    if (existingInscription) {
      return NextResponse.json({ error: "Você já está inscrito neste bolão." }, { status: 400 });
    }

    const inscription = await prisma.inscription.create({
      data: {
        userId: Number(session.user.id),
        bolaoId: Number(bolaoId),
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json(inscription, { status: 201 });
  } catch (error) {
    console.error("Erro ao realizar inscrição:", error);
    return NextResponse.json({ error: "Erro interno ao realizar inscrição." }, { status: 500 });
  }
}
