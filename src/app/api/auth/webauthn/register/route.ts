import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";

const rpName = "Bolão da Galera";
const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
const origin = process.env.NEXT_PUBLIC_APP_URL || `http://${rpID}:3000`;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: { authenticators: true }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new Uint8Array(Buffer.from(user.id.toString())),
    userName: user.email,
    attestationType: "none",
    excludeCredentials: user.authenticators.map(auth => ({
      id: auth.credentialID,
      type: "public-key"
    })),
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "preferred"
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { currentChallenge: options.challenge }
  });

  return NextResponse.json(options);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) }
  });

  if (!user || !user.currentChallenge) {
    return NextResponse.json({ error: "User or challenge not found" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

      await prisma.authenticator.create({
        data: {
          credentialID: credential.id,
          userId: user.id,
          providerAccountId: credential.id,
          credentialPublicKey: Buffer.from(credential.publicKey).toString('base64url'),
          counter: credential.counter,
          credentialDeviceType: credentialDeviceType,
          credentialBackedUp: credentialBackedUp,
          transports: JSON.stringify(credential.transports || [])
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { currentChallenge: null }
      });

      return NextResponse.json({ verified: true });
    }
  } catch (error: any) {
    console.error("Verification error", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 400 });
}
