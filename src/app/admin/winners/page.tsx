import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminWinnersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Buscar todos os bolões finalizados
  const finishedBoloes = await prisma.bolao.findMany({
    where: { status: "FINISHED" },
    include: {
      _count: { select: { inscriptions: true } },
      prizeRules: true
    },
    orderBy: { createdAt: "desc" }
  });

  const winnersList = [];

  for (const bolao of finishedBoloes) {
    const allPredictions = await prisma.prediction.findMany({
      where: { game: { bolaoId: bolao.id } },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, cpf: true, pixKey: true }
        }
      }
    });

    const rankingMap: Record<number, { user: any, points: number, exactMatches: number }> = {};
    
    for (const p of allPredictions) {
      if (!rankingMap[p.userId]) {
        rankingMap[p.userId] = { user: p.user, points: 0, exactMatches: 0 };
      }
      rankingMap[p.userId].points += p.pointsEarned;
      if (p.pointsEarned === bolao.exactScorePoints) {
        rankingMap[p.userId].exactMatches += 1;
      }
    }

    const realRanking = Object.values(rankingMap)
      .sort((a, b) => b.points - a.points || b.exactMatches - a.exactMatches);

    if (realRanking.length > 0) {
      const winner = realRanking[0];
      const totalQuota = bolao.quotaValue * bolao._count.inscriptions;
      const netPool = totalQuota * ((100 - bolao.orgFeePercent) / 100);
      const firstPlaceRule = bolao.prizeRules.find(r => r.position === 1);
      const prizeAmount = firstPlaceRule ? (netPool * firstPlaceRule.percentage / 100) : netPool;

      winnersList.push({
        bolaoId: bolao.id,
        bolaoName: bolao.name,
        winnerUser: winner.user,
        points: winner.points,
        prizeAmount
      });
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">🏆 Vencedores dos Bolões</h1>

        {winnersList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            Nenhum bolão foi finalizado ainda ou não há ganhadores.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winnersList.map(item => (
              <div key={item.bolaoId} className="bg-white rounded-2xl shadow-lg border-2 border-brasil-yellow overflow-hidden relative">
                <div className="bg-brasil-green p-4 text-center">
                  <div className="text-4xl mb-2">🏅</div>
                  <h2 className="font-display font-bold text-xl text-white line-clamp-1">{item.bolaoName}</h2>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-slate-500 uppercase font-bold mb-1">Ganhador</p>
                    <p className="font-bold text-2xl text-slate-800">{item.winnerUser.name}</p>
                    <p className="text-brasil-blue font-bold text-lg">{item.points} Pontos</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 text-center">
                    <p className="text-sm text-slate-500 mb-1">Prêmio Estimado</p>
                    <p className="font-bold text-3xl text-brasil-green">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.prizeAmount)}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>E-mail:</strong> {item.winnerUser.email}</p>
                    <p><strong>Telefone:</strong> {item.winnerUser.phone || 'Não informado'}</p>
                    <p><strong>CPF:</strong> {item.winnerUser.cpf || 'Não informado'}</p>
                    <div className="bg-brasil-yellow/20 p-2 rounded mt-2 border border-brasil-yellow">
                      <p className="text-xs font-bold text-slate-700 uppercase mb-1">Chave PIX</p>
                      <p className="font-bold text-slate-900 break-all">{item.winnerUser.pixKey || 'Não informada'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
