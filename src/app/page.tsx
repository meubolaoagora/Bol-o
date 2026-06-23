import { prisma } from "@/lib/db";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const boloes = await prisma.bolao.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { inscriptions: true } }
    }
  });

  const formattedBoloes = boloes.map(b => ({
    id: b.id.toString(),
    name: b.name,
    participantsCount: b._count.inscriptions,
    entryFee: b.quotaValue,
  }));

  return <HomePageClient boloes={formattedBoloes} />;
}
