import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import BolaoDetailsClient from "./BolaoDetailsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BolaoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const bolaoId = parseInt(id, 10);
  if (isNaN(bolaoId)) notFound();

  const bolao = await prisma.bolao.findUnique({
    where: { id: bolaoId },
    include: {
      _count: { select: { inscriptions: true } }
    }
  });

  if (!bolao) notFound();

  // Get games for this bolao
  const games = await prisma.game.findMany({
    where: { bolaoId },
    orderBy: { matchDate: 'asc' }
  });

  // Get Admin phone for WhatsApp
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { phone: true }
  });
  const adminPhone = adminUser?.phone || "5511000000000";

  // Get current user predictions if logged in
  let userPredictions: Record<number, { scoreA: number, scoreB: number }> = {};
  
  if (session?.user?.id) {
    const predictions = await prisma.prediction.findMany({
      where: { 
        userId: parseInt(session.user.id),
        gameId: { in: games.map(g => g.id) }
      }
    });
    
    userPredictions = predictions.reduce((acc, curr) => {
      acc[curr.gameId] = { scoreA: curr.predictedScoreA, scoreB: curr.predictedScoreB };
      return acc;
    }, {} as Record<number, { scoreA: number, scoreB: number }>);
  }

  // Calculate prize pool
  const prizePool = bolao.quotaValue * bolao._count.inscriptions * ((100 - bolao.orgFeePercent) / 100);

  // Map games to frontend component format
  const formattedGames = games.map(g => ({
    id: g.id.toString(),
    date: g.matchDate.toISOString(),
    stadium: g.phase,
    status: g.status.toLowerCase() as "scheduled" | "live" | "finished",
    homeScore: g.scoreA ?? undefined,
    awayScore: g.scoreB ?? undefined,
    homeTeam: { id: g.teamA, name: g.teamA, code: g.teamA.substring(0,3).toUpperCase(), flagUrl: `https://flagcdn.com/br.svg` }, // Placeholder flag
    awayTeam: { id: g.teamB, name: g.teamB, code: g.teamB.substring(0,3).toUpperCase(), flagUrl: `https://flagcdn.com/ar.svg` }  // Placeholder flag
  }));

  // Calculate Ranking
  const allPredictions = await prisma.prediction.findMany({
    where: { game: { bolaoId } },
    include: { user: { select: { id: true, name: true } } }
  });

  const rankingMap: Record<number, { id: string, name: string, points: number, exactMatches: number }> = {};
  for (const p of allPredictions) {
    if (!rankingMap[p.userId]) {
      rankingMap[p.userId] = { id: p.userId.toString(), name: p.user.name, points: 0, exactMatches: 0 };
    }
    rankingMap[p.userId].points += p.pointsEarned;
    if (p.pointsEarned === bolao.exactScorePoints) {
      rankingMap[p.userId].exactMatches += 1;
    }
  }

  const realRanking = Object.values(rankingMap)
    .sort((a, b) => b.points - a.points || b.exactMatches - a.exactMatches)
    .map((r, i) => ({ ...r, position: i + 1 }));

  return (
    <BolaoDetailsClient 
      bolao={bolao} 
      games={formattedGames} 
      prizePool={prizePool}
      participantsCount={bolao._count.inscriptions}
      userPredictions={userPredictions}
      isLoggedIn={!!session}
      ranking={realRanking}
      adminPhone={adminPhone}
    />
  );
}
