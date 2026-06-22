import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import Link from "next/link";
import UpdateResultForm from "./UpdateResultForm";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage({ searchParams }: { searchParams: Promise<{ bolaoId?: string }> }) {
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
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">Resultados Oficiais</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Selecione o Bolão</label>
          <div className="flex gap-4">
            {boloes.map(b => (
              <Link 
                key={b.id} 
                href={`/admin/results?bolaoId=${b.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${selectedBolaoId === b.id ? 'bg-brasil-green text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>

        {selectedBolaoId ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="font-bold text-xl text-slate-800">Lançar Placares Finais</h2>
              <p className="text-sm text-slate-500">Ao salvar o resultado, o ranking será recalculado automaticamente.</p>
            </div>
            
            {games.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum jogo cadastrado para este bolão.</p>
            ) : (
              <div className="space-y-6">
                {games.map(game => (
                  <UpdateResultForm key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-center">Crie um bolão primeiro.</p>
        )}
      </div>
    </AdminLayout>
  );
}
