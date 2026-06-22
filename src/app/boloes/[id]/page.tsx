"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { GameCard, Game } from "@/components/GameCard";
import { RankingTable, RankingEntry } from "@/components/RankingTable";
import { PixInfo } from "@/components/PixInfo";

// Mock Data
const mockRanking: RankingEntry[] = [
  { id: "1", position: 1, name: "João Silva", points: 125, exactMatches: 4 },
  { id: "2", position: 2, name: "Maria Oliveira", points: 110, exactMatches: 3 },
  { id: "3", position: 3, name: "Pedro Santos", points: 95, exactMatches: 2 },
  { id: "4", position: 4, name: "Ana Costa", points: 80, exactMatches: 1 },
  { id: "5", position: 5, name: "Lucas Lima", points: 75, exactMatches: 1 },
];

const mockGames: Game[] = [
  {
    id: "g1",
    date: "2026-06-11T16:00:00Z",
    stadium: "Maracanã",
    status: "scheduled",
    homeTeam: { id: "t1", name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/br.svg" },
    awayTeam: { id: "t2", name: "Sérvia", code: "SRB", flagUrl: "https://flagcdn.com/rs.svg" }
  },
  {
    id: "g2",
    date: "2026-06-15T13:00:00Z",
    stadium: "Morumbi",
    status: "live",
    homeScore: 1,
    awayScore: 0,
    homeTeam: { id: "t3", name: "Argentina", code: "ARG", flagUrl: "https://flagcdn.com/ar.svg" },
    awayTeam: { id: "t4", name: "Croácia", code: "CRO", flagUrl: "https://flagcdn.com/hr.svg" }
  },
  {
    id: "g3",
    date: "2026-06-10T16:00:00Z",
    stadium: "Arena Corinthians",
    status: "finished",
    homeScore: 2,
    awayScore: 2,
    homeTeam: { id: "t5", name: "França", code: "FRA", flagUrl: "https://flagcdn.com/fr.svg" },
    awayTeam: { id: "t6", name: "Inglaterra", code: "ENG", flagUrl: "https://flagcdn.com/gb-eng.svg" }
  }
];

export default function BolaoDetailsPage() {
  const [activeTab, setActiveTab] = useState<"ranking" | "palpites" | "pagamento">("ranking");

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      
      {/* Header Bolão */}
      <div className="bg-brasil-blue pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status="open" />
                <span className="text-brasil-yellow font-bold text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  ID: #BL-1234
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
                Bolão da Firma
              </h1>
              <p className="text-blue-200">Organizado por João Silva</p>
            </div>

            <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-center">
                <div className="text-xs text-blue-200 uppercase font-semibold">Participantes</div>
                <div className="font-display font-bold text-2xl text-white">42</div>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-xs text-brasil-yellow uppercase font-semibold">Prêmio</div>
                <div className="font-display font-bold text-2xl text-brasil-yellow">R$ 2.100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 w-full relative z-20 pb-12">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 mb-8 flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab("ranking")}
            className={`flex-1 min-w-[120px] py-3 px-4 text-center font-bold rounded-lg transition-all ${activeTab === "ranking" ? "bg-brasil-green text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          >
            🏆 Ranking
          </button>
          <button 
            onClick={() => setActiveTab("palpites")}
            className={`flex-1 min-w-[120px] py-3 px-4 text-center font-bold rounded-lg transition-all ${activeTab === "palpites" ? "bg-brasil-blue text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          >
            ⚽ Palpites
          </button>
          <button 
            onClick={() => setActiveTab("pagamento")}
            className={`flex-1 min-w-[120px] py-3 px-4 text-center font-bold rounded-lg transition-all ${activeTab === "pagamento" ? "bg-brasil-yellow text-brasil-blue shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          >
            💲 Pagamento
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "ranking" && (
          <div className="animate-fade-in">
            <RankingTable entries={mockRanking} />
          </div>
        )}

        {activeTab === "palpites" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brasil-blue">Seus Palpites</h3>
              <button className="btn-brasil-yellow text-sm px-4 py-2">Salvar Palpites</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockGames.map((game, i) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  userHomeScore={i === 2 ? 1 : undefined}
                  userAwayScore={i === 2 ? 1 : undefined}
                  readOnly={game.status === "finished" || game.status === "live"}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "pagamento" && (
          <div className="animate-fade-in max-w-md mx-auto">
            <PixInfo 
              amount={50} 
              pixKey="00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540550.005802BR5913Joao da Silva6008BRASILIA62070503***63041A2B"
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
