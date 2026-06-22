import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { inscriptions: true, predictions: true }
      }
    }
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">Usuários Cadastrados</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Usuário</th>
                  <th className="px-6 py-4 font-semibold">Contato</th>
                  <th className="px-6 py-4 font-semibold">Estatísticas</th>
                  <th className="px-6 py-4 font-semibold">Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300 overflow-hidden flex-shrink-0">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name || "Foto"} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{user.name || "Sem Nome"}</div>
                          <div className="text-xs text-slate-500">Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{user.email}</div>
                      {user.pixKey && (
                        <div className="text-xs text-brasil-green font-medium mt-1">PIX: {user.pixKey}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        <span className="font-bold text-slate-800">{user._count.inscriptions}</span> Bolões
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-bold text-slate-800">{user._count.predictions}</span> Palpites
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-brasil-blue text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Nenhum usuário encontrado no sistema.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
