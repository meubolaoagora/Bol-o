import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  let allowCredentials: { id: string; type: "public-key" }[] | undefined = undefined;

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { authenticators: true }
    });

    if (user && user.authenticators.length > 0) {
      allowCredentials = user.authenticators.map(auth => ({
        id: auth.credentialID,
        type: "public-key",
      }));
    }
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: "preferred",
  });

  // We need to save the challenge somewhere to verify it later.
  // Since the user might not be logged in, we could store it in a generic table
  // or a cookie, or return it to the client and let the client pass it back (less secure but standard for stateless NextAuth unless we use cookies).
  // Actually, standard practice for stateless is to store it in a secure HttpOnly cookie or DB table.
  // Since we want it simple, we'll return it and expect it back, but wait...
  // The client must not temper with the challenge.
  
  // Let's store it in a generic "AuthChallenge" table? We don't have one.
  // We can just update the user if email is provided. If not, we have a problem.
  // Let's just require `email` for now, so we can save it on the User object!
  if (email) {
    await prisma.user.update({
      where: { email },
      data: { currentChallenge: options.challenge }
    });
  } else {
     // If we don't have email, we could return it but how do we verify?
     // For this simple implementation, let's require email.
     return NextResponse.json({ error: "Email is required for now" }, { status: 400 });
  }

  return NextResponse.json(options);
}
