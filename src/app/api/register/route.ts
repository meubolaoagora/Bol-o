import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, cpf, pixKey } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado." },
        { status: 400 }
      );
    }

    // Generate a random password if not provided
    const pass = password || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(pass, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        pixKey,
        passwordHash,
        role: "PARTICIPANT",
      },
    });

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o registro." },
      { status: 500 }
    );
  }
}
