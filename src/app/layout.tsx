import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bolão da Galera | Bolões de Copa do Mundo entre Amigos",
  description:
    "Crie bolões, palpite nos jogos da Copa e dispute prêmios com seus amigos. Plataforma peer-to-peer segura e divertida.",
  keywords: ["bolão", "copa do mundo", "futebol", "palpites", "amigos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
