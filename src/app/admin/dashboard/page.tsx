import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin/dashboard" className="font-display font-bold text-xl text-white tracking-wider flex items-center gap-2">
              <span>Bolão Admin</span>
              <span className="bg-blue-600 text-xs px-2 py-0.5 rounded text-white">v1.0</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Olá, Admin</span>
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Sair</button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">Dashboard</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-500 uppercase">Usuários Ativos</div>
            <div className="mt-2 text-3xl font-display font-bold text-blue-600">1,204</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-500 uppercase">Bolões Criados</div>
            <div className="mt-2 text-3xl font-display font-bold text-brasil-green">86</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-500 uppercase">Total Movimentado</div>
            <div className="mt-2 text-3xl font-display font-bold text-brasil-yellow-dark">R$ 45k</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-500 uppercase">Jogos Hoje</div>
            <div className="mt-2 text-3xl font-display font-bold text-slate-800">4</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link href="/admin/games" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="font-medium text-slate-700">Gerenciar Jogos</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link href="/admin/results" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="font-medium text-slate-700">Atualizar Resultados Oficiais</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link href="/admin/users" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="font-medium text-slate-700">Gerenciar Usuários</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <button className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors group text-left">
                <span className="font-medium">Recalcular Pontuações (Force)</span>
                <span className="text-red-500">⚠️</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Jogos Recentes (Resultados Pendentes)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Jogo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">Hoje, 16:00</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">Brasil vs Sérvia</td>
                    <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Ao Vivo</span></td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Atualizar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">Ontem, 13:00</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">Argentina vs Croácia</td>
                    <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Finalizado</span></td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Editar Placar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-4 text-center text-xs text-slate-500 mt-auto">
        &copy; {new Date().getFullYear()} Sistema Admin - Bolão da Galera
      </footer>
    </div>
  );
}
