import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BolaoCard } from "@/components/BolaoCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BoloesPage() {
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
    owner: "Admin", // Currently all belong to Admin
    participantsCount: b._count.inscriptions,
    entryFee: b.quotaValue,
    prizePool: b.quotaValue * b._count.inscriptions * ((100 - b.orgFeePercent) / 100),
    status: b.status.toLowerCase() as "open" | "live" | "finished" | "confirmed",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-10">
            <h1 className="font-display font-bold text-4xl text-brasil-blue mb-2">
              BOLÕES OFICIAIS DISPONÍVEIS
            </h1>
            <p className="text-gray-600 text-lg">
              Participe agora mesmo dos bolões oficiais da galera!
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-gray-500 uppercase">Filtros:</span>
            <button className="px-4 py-2 bg-brasil-green text-white text-sm font-bold rounded-lg">Todos</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold rounded-lg transition-colors">Abertos</button>
            
            <div className="ml-auto w-full md:w-auto relative">
              <input 
                type="text" 
                placeholder="Buscar por nome..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brasil-green focus:border-brasil-green outline-none"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          {/* Grid */}
          {formattedBoloes.length === 0 ? (
             <div className="bg-white p-10 rounded-xl text-center shadow-sm border border-slate-200">
               <h2 className="text-2xl font-bold text-slate-700 mb-2">Nenhum bolão aberto no momento</h2>
               <p className="text-slate-500">Volte mais tarde para participar dos próximos bolões.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedBoloes.map((bolao) => (
                <BolaoCard key={bolao.id} bolao={bolao} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
