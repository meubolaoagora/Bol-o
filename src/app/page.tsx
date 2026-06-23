import { prisma } from "@/lib/db";
import HomePageClient from "./HomePageClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
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

  // WINNER LOGIC
  let winnerInfo = null;
  let adminPhone = "5511000000000";

  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { phone: true }
  });
  if (adminUser?.phone) adminPhone = adminUser.phone;

  if (session?.user?.id) {
    const userId = parseInt(session.user.id);
    const finishedBoloes = await prisma.bolao.findMany({
      where: { status: "FINISHED", inscriptions: { some: { userId } } },
      include: {
        _count: { select: { inscriptions: true } },
        prizeRules: true
      }
    });

    for (const bolao of finishedBoloes) {
      const allPredictions = await prisma.prediction.findMany({
        where: { game: { bolaoId: bolao.id } }
      });

      const rankingMap: Record<number, { points: number, exactMatches: number }> = {};
      for (const p of allPredictions) {
        if (!rankingMap[p.userId]) {
          rankingMap[p.userId] = { points: 0, exactMatches: 0 };
        }
        rankingMap[p.userId].points += p.pointsEarned;
        if (p.pointsEarned === bolao.exactScorePoints) {
          rankingMap[p.userId].exactMatches += 1;
        }
      }

      const realRanking = Object.keys(rankingMap)
        .map(k => ({ userId: parseInt(k), ...rankingMap[parseInt(k)] }))
        .sort((a, b) => b.points - a.points || b.exactMatches - a.exactMatches);

      if (realRanking.length > 0 && realRanking[0].userId === userId) {
        const totalQuota = bolao.quotaValue * bolao._count.inscriptions;
        const netPool = totalQuota * ((100 - bolao.orgFeePercent) / 100);
        const firstPlaceRule = bolao.prizeRules.find(r => r.position === 1);
        const prizeAmount = firstPlaceRule ? (netPool * firstPlaceRule.percentage / 100) : netPool;

        winnerInfo = {
          bolaoId: bolao.id,
          bolaoName: bolao.name,
          prizeAmount: prizeAmount
        };
        break; // Show one at a time
      }
    }
  }

  return <HomePageClient boloes={formattedBoloes} winnerInfo={winnerInfo} adminPhone={adminPhone} />;
}
