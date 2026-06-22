import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BolaoCard, Bolao } from "@/components/BolaoCard";

const mockBoloes: Bolao[] = [
  {
    id: "1",
    name: "Bolão da Firma",
    owner: "João Silva",
    participantsCount: 42,
    entryFee: 50,
    prizePool: 2100,
    status: "open",
  },
  {
    id: "2",
    name: "Família Buscapé",
    owner: "Maria Oliveira",
    participantsCount: 15,
    entryFee: 20,
    prizePool: 300,
    status: "open",
  },
  {
    id: "3",
    name: "Amigos do Futebol",
    owner: "Carlos Santos",
    participantsCount: 120,
    entryFee: 100,
    prizePool: 12000,
    status: "confirmed",
  },
  {
    id: "4",
    name: "Galera do Condomínio",
    owner: "Síndico",
    participantsCount: 34,
    entryFee: 30,
    prizePool: 1020,
    status: "open",
  },
  {
    id: "5",
    name: "Liga dos Campeões",
    owner: "Admin",
    participantsCount: 500,
    entryFee: 0,
    prizePool: 5000,
    status: "live",
  },
  {
    id: "6",
    name: "Bolão Retrô 2002",
    owner: "Penta",
    participantsCount: 55,
    entryFee: 50,
    prizePool: 2750,
    status: "finished",
  }
];

export default function BoloesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h1 className="font-display font-bold text-4xl text-brasil-blue mb-2">
                BOLÕES DISPONÍVEIS
              </h1>
              <p className="text-gray-600 text-lg">
                Encontre o bolão perfeito para você ou crie o seu próprio.
              </p>
            </div>
            
            <button className="btn-brasil-yellow shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span>➕</span> Criar Novo Bolão
            </button>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-gray-500 uppercase">Filtros:</span>
            <button className="px-4 py-2 bg-brasil-green text-white text-sm font-bold rounded-lg">Todos</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold rounded-lg transition-colors">Abertos</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold rounded-lg transition-colors">Gratuitos</button>
            
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBoloes.map((bolao) => (
              <BolaoCard key={bolao.id} bolao={bolao} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
