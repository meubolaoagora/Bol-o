import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
const origin = process.env.NEXT_PUBLIC_APP_URL || `http://${rpID}:3000`;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
        webauthnResponse: { label: "WebAuthn Response", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("E-mail é obrigatório.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("E-mail não encontrado.");
        }

        if (credentials.webauthnResponse) {
          // WebAuthn Flow
          if (!user.currentChallenge) {
            throw new Error("Nenhum desafio de login encontrado. Tente novamente.");
          }

          const body = JSON.parse(credentials.webauthnResponse);
          
          const authenticator = await prisma.authenticator.findFirst({
            where: { credentialID: body.id, userId: user.id }
          });

          if (!authenticator) {
            throw new Error("Credencial não encontrada para este usuário.");
          }

          let verification;
          try {
            verification = await verifyAuthenticationResponse({
              response: body,
              expectedChallenge: user.currentChallenge,
              expectedOrigin: origin,
              expectedRPID: rpID,
              credential: {
                id: authenticator.credentialID,
                publicKey: new Uint8Array(Buffer.from(authenticator.credentialPublicKey, 'base64url')),
                counter: authenticator.counter,
                transports: authenticator.transports ? JSON.parse(authenticator.transports) : undefined
              }
            });
          } catch (e: any) {
            console.error(e);
            throw new Error("Falha na validação biométrica.");
          }

          if (verification.verified) {
            await prisma.authenticator.update({
              where: { credentialID: authenticator.credentialID },
              data: { counter: verification.authenticationInfo.newCounter }
            });
            await prisma.user.update({
              where: { id: user.id },
              data: { currentChallenge: null }
            });
          } else {
            throw new Error("Biometria não verificada.");
          }

        } else {
          // Password Flow
          if (!credentials.password) throw new Error("Senha é obrigatória.");
          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
          }
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_para_build_vercel",
};
