"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { GameCard, Game } from "@/components/GameCard";
import { RankingTable, RankingEntry } from "@/components/RankingTable";
import { PixInfo } from "@/components/PixInfo";

import { signIn } from "next-auth/react";

export default function BolaoDetailsClient({ 
  bolao, 
  games, 
  prizePool, 
  participantsCount,
  userPredictions,
  isLoggedIn,
  ranking
}: any) {
  // Determine initial state based on login
  const [activeTab, setActiveTab] = useState<"registro" | "pagamento" | "palpites" | "ranking">(isLoggedIn ? "ranking" : "registro");
  const [formData, setFormData] = useState({ name: "", email: "", cpf: "", pixKey: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  
  // Convert array/object of userPredictions into a workable state map by gameId
  const initialPredictions = Object.keys(userPredictions || {}).reduce((acc: any, key) => {
    acc[key] = {
      scoreA: userPredictions[key]?.scoreA ?? null,
      scoreB: userPredictions[key]?.scoreB ?? null
    };
    return acc;
  }, {});

  const [localPredictions, setLocalPredictions] = useState<{ [gameId: string]: { scoreA: number | null, scoreB: number | null } }>(initialPredictions);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleScoreChange = (gameId: string, homeScore: number, awayScore: number) => {
    setLocalPredictions(prev => ({
      ...prev,
      [gameId]: { scoreA: homeScore, scoreB: awayScore }
    }));
  };

  const handleSavePredictions = async () => {
    setSaving(true);
    setMessage("");

    const predictionsToSave = Object.keys(localPredictions)
      .filter(gameId => localPredictions[gameId].scoreA !== null && localPredictions[gameId].scoreB !== null)
      .map(gameId => ({
        gameId: parseInt(gameId),
        predictedScoreA: localPredictions[gameId].scoreA,
        predictedScoreB: localPredictions[gameId].scoreB
      }));

    if (predictionsToSave.length === 0) {
      setMessage("Preencha ao menos um palpite completo (os dois placares) para salvar.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/palpites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictionsToSave)
      });

      if (res.ok) {
        setMessage("✅ Palpites salvos! Redirecionando para o WhatsApp...");
        setTimeout(() => {
          const text = encodeURIComponent(`Olá, acabei de fazer meus palpites no bolão *${bolao.name}* e aqui está meu comprovante de pagamento!`);
          window.open(`https://wa.me/5511000000000?text=${text}`, "_blank");
          setMessage("");
        }, 1500);
      } else {
        const err = await res.json();
        setMessage(`❌ Erro: ${err.error || "Falha ao salvar."}`);
      }
    } catch (e) {
      setMessage("❌ Erro de conexão ao salvar palpites.");
    } finally {
      setSaving(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");

    const password = Math.random().toString(36).slice(-8); // Generate random password
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password })
      });

      if (res.ok) {
        // Log user in automatically
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: password,
        });

        if (result?.error) {
          setRegError("Conta criada, mas falha no login automático.");
        } else {
          // Go to payment tab
          setActiveTab("pagamento");
        }
      } else {
        const err = await res.json();
        setRegError(err.error || "Erro ao criar conta.");
      }
    } catch (error) {
      setRegError("Falha de conexão.");
    } finally {
      setRegLoading(false);
    }
  };

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
                <StatusBadge status={bolao.status.toLowerCase()} />
                <span className="text-brasil-yellow font-bold text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  ID: #BL-{bolao.id}
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
                {bolao.name}
              </h1>
              <p className="text-blue-200">Encerramento das inscrições: {new Date(bolao.registrationDeadline).toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-center">
                <div className="text-xs text-blue-200 uppercase font-semibold">Participantes</div>
                <div className="font-display font-bold text-2xl text-white">{participantsCount}</div>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-xs text-brasil-yellow uppercase font-semibold">Prêmio Total</div>
                <div className="font-display font-bold text-2xl text-brasil-yellow">R$ {prizePool.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 w-full relative z-20 pb-12">
        {/* Navigation Tabs (Only show if logged in) */}
        {isLoggedIn && (
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
        )}

        {/* Tab Content */}
        {!isLoggedIn && activeTab === "registro" && (
          <div className="animate-fade-in max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="font-display font-bold text-3xl text-brasil-blue mb-2 text-center">Entre no Bolão</h2>
            <p className="text-gray-500 text-center mb-6">Preencha rapidamente para garantir sua vaga.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{regError}</div>}
              
              <div>
                <input required type="text" placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brasil-green outline-none" />
              </div>
              <div>
                <input required type="email" placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brasil-green outline-none" />
              </div>
              <div>
                <input required type="text" placeholder="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brasil-green outline-none" />
              </div>
              <div>
                <input required type="text" placeholder="Sua Chave PIX" value={formData.pixKey} onChange={e => setFormData({...formData, pixKey: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brasil-green outline-none" />
              </div>
              
              <button type="submit" disabled={regLoading} className="w-full py-4 bg-brasil-green hover:bg-brasil-green-dark text-white font-bold rounded-xl shadow-lg transition-colors text-lg mt-4 disabled:opacity-50">
                {regLoading ? "Registrando..." : "Confirmar e Pagar"}
              </button>
            </form>
            
            <div className="mt-6 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 mb-2">Já possui cadastro?</p>
              <a href="/auth" className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-brasil-blue font-bold rounded-xl transition-colors">
                🔐 Entrar com Face ID ou E-mail
              </a>
            </div>
          </div>
        )}

        {isLoggedIn && activeTab === "ranking" && (
          <div className="animate-fade-in">
            {ranking.length > 0 ? (
              <RankingTable entries={ranking} />
            ) : (
              <p className="text-center text-slate-500 py-10 bg-white rounded-xl shadow-sm border border-slate-200">
                Ninguém pontuou ainda. Faça seus palpites e aguarde os resultados!
              </p>
            )}
          </div>
        )}

        {activeTab === "palpites" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
              <h3 className="font-display font-bold text-xl text-brasil-blue">Jogos do Bolão</h3>
              {isLoggedIn ? (
                 <div className="flex items-center gap-3">
                   {message && <span className="text-sm font-bold animate-fade-in">{message}</span>}
                   <button 
                     onClick={handleSavePredictions}
                     disabled={saving}
                     className="btn-brasil-yellow text-sm px-4 py-2 disabled:opacity-50"
                   >
                     {saving ? "Salvando..." : "Salvar Meus Palpites"}
                   </button>
                 </div>
              ) : (
                 <span className="text-sm text-red-500 font-bold">Faça login para palpitar</span>
              )}
            </div>
            
            {games.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum jogo cadastrado pelo administrador ainda.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {games.map((game: any) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    userHomeScore={localPredictions[game.id]?.scoreA ?? undefined}
                    userAwayScore={localPredictions[game.id]?.scoreB ?? undefined}
                    onScoreChange={handleScoreChange}
                    readOnly={game.status === "finished" || game.status === "live" || !isLoggedIn}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {isLoggedIn && activeTab === "pagamento" && (
          <div className="animate-fade-in max-w-md mx-auto">
            <PixInfo 
              amount={bolao.quotaValue} 
              pixKey={bolao.pixKey}
              qrCodeUrl={bolao.pixQrCodePath}
            />
            <div className="mt-6 text-center">
              <button 
                onClick={() => setActiveTab("palpites")}
                className="w-full bg-brasil-blue hover:bg-brasil-blue-light text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors text-lg animate-bounce-in"
              >
                Já paguei! Ir para Palpites ⚽
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
