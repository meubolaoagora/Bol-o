import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const { id } = await params;
    const inscriptionId = Number(id);

    const inscription = await prisma.inscription.findUnique({
      where: { id: inscriptionId },
    });

    if (!inscription) {
      return NextResponse.json({ error: "Inscrição não encontrada." }, { status: 404 });
    }

    const updatedInscription = await prisma.inscription.update({
      where: { id: inscriptionId },
      data: {
        paymentStatus: "CONFIRMED",
      },
    });

    return NextResponse.json({ message: "Pagamento confirmado.", inscription: updatedInscription });
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return NextResponse.json({ error: "Erro interno ao confirmar pagamento." }, { status: 500 });
  }
}
