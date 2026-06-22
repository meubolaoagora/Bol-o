import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const boloes = await prisma.bolao.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { inscriptions: true, games: true }
      }
    }
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-800">Meus Bolões</h1>
        <Link 
          href="/admin/boloes/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
        >
          + Novo Bolão
        </Link>
      </div>

      {boloes.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-slate-200">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Nenhum bolão criado ainda</h2>
          <p className="text-slate-500 mb-6">Crie seu primeiro bolão para começar a organizar os jogos da galera.</p>
          <Link href="/admin/boloes/create" className="text-blue-600 font-bold hover:underline">Criar Bolão Agora</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boloes.map((bolao) => (
            <div key={bolao.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-bold text-xl text-slate-800 line-clamp-1">{bolao.name}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${bolao.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {bolao.status === 'OPEN' ? 'ABERTO' : 'FECHADO'}
                </span>
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Cota de Entrada:</span>
                  <span className="font-bold text-slate-800">R$ {bolao.quotaValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Participantes:</span>
                  <span className="font-bold text-slate-800">{bolao._count.inscriptions}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Jogos:</span>
                  <span className="font-bold text-slate-800">{bolao._count.games}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Link href={`/admin/boloes/${bolao.id}/edit`} className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors">
                  Editar e PIX
                </Link>
                <Link href={`/admin/games?bolaoId=${bolao.id}`} className="flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-medium transition-colors">
                  Ver Jogos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
