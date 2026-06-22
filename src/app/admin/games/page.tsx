import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import Link from "next/link";
import CreateGameForm from "./CreateGameForm";

export const dynamic = "force-dynamic";

export default async function AdminGamesPage({ searchParams }: { searchParams: Promise<{ bolaoId?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { bolaoId } = await searchParams;
  const boloes = await prisma.bolao.findMany({ orderBy: { createdAt: 'desc' } });
  
  const selectedBolaoId = bolaoId ? parseInt(bolaoId) : (boloes[0]?.id || null);

  const games = selectedBolaoId ? await prisma.game.findMany({
    where: { bolaoId: selectedBolaoId },
    orderBy: { matchDate: 'asc' }
  }) : [];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">Gerenciar Jogos</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Selecione o Bolão</label>
          <div className="flex gap-4">
            {boloes.map(b => (
              <Link 
                key={b.id} 
                href={`/admin/games?bolaoId=${b.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${selectedBolaoId === b.id ? 'bg-brasil-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>

        {selectedBolaoId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <h2 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Novo Jogo</h2>
                <CreateGameForm bolaoId={selectedBolaoId} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Jogos Cadastrados</h2>
                
                {games.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhum jogo cadastrado para este bolão.</p>
                ) : (
                  <div className="space-y-4">
                    {games.map(game => (
                      <div key={game.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex-1">
                          <div className="text-xs font-bold text-blue-600 mb-1">{game.phase.toUpperCase()}</div>
                          <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
                            <span>{game.teamA}</span>
                            <span className="text-slate-400 text-sm">vs</span>
                            <span>{game.teamB}</span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {new Date(game.matchDate).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${game.status === 'FINISHED' ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-800'}`}>
                            {game.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center">Crie um bolão primeiro para poder gerenciar jogos.</p>
        )}
      </div>
    </AdminLayout>
  );
}
