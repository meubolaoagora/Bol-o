"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePageClient({ boloes, winnerInfo, adminPhone }: { boloes: any[], winnerInfo?: any, adminPhone?: string }) {
  const [loading, setLoading] = useState(true);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Check if user won and hasn't seen the popup yet
      if (winnerInfo) {
        const hasSeen = localStorage.getItem(`won_bolao_${winnerInfo.bolaoId}`);
        if (!hasSeen) {
          setShowWinner(true);
        }
      }
    }, 2500); // 2.5s splash screen
    return () => clearTimeout(timer);
  }, [winnerInfo]);

  const handleClaimPrize = () => {
    if (!winnerInfo) return;
    
    // Mark as seen
    localStorage.setItem(`won_bolao_${winnerInfo.bolaoId}`, "true");
    setShowWinner(false);

    // Redirect to WhatsApp
    const cleanPhone = (adminPhone || "5511000000000").replace(/\D/g, '');
    const formattedPrize = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(winnerInfo.prizeAmount);
    const text = encodeURIComponent(`Olá! Eu ganhei o bolão *${winnerInfo.bolaoName}*! Meu prêmio é de ${formattedPrize}. Como faço para receber?`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-brasil-yellow rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
            <Image 
              src="/logo.jpg" 
              alt="Logo Meu Bolão" 
              width={150} 
              height={150} 
              className="relative z-10 rounded-full border-4 border-white/20 shadow-2xl animate-[breathe_4s_ease-in-out_infinite]"
            />
          </div>
          <h1 className="font-display font-bold text-3xl text-brasil-blue mb-8">Meu Bolão</h1>
          
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-brasil-green rounded-full animate-progress"></div>
          </div>
          <p className="mt-4 text-gray-500 text-sm font-medium animate-pulse">Carregando bolões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 relative">
        
        {/* WINNER POPUP */}
        {showWinner && winnerInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-bounce-in border-4 border-brasil-yellow">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">
                🏆
              </div>
              <h2 className="font-display font-bold text-4xl text-brasil-green mt-6 mb-2">
                VOCÊ GANHOU!
              </h2>
              <p className="text-slate-600 mb-4 font-medium">
                Parabéns! Você ficou em 1º lugar no bolão:
                <br/>
                <strong className="text-lg text-brasil-blue">{winnerInfo.bolaoName}</strong>
              </p>
              
              <div className="bg-brasil-yellow/20 rounded-2xl p-4 mb-6">
                <p className="text-sm text-brasil-blue-dark font-bold uppercase mb-1">Seu Prêmio</p>
                <p className="font-display font-bold text-4xl text-brasil-green">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(winnerInfo.prizeAmount)}
                </p>
              </div>

              <button 
                onClick={handleClaimPrize}
                className="w-full py-4 bg-brasil-green hover:bg-brasil-green-dark text-white font-bold rounded-xl shadow-[0_8px_0_0_#007A2F] active:translate-y-2 active:shadow-[0_0px_0_0_#007A2F] transition-all text-xl"
              >
                Resgatar no WhatsApp 📲
              </button>
              
              <button 
                onClick={() => {
                  localStorage.setItem(`won_bolao_${winnerInfo.bolaoId}`, "true");
                  setShowWinner(false);
                }}
                className="mt-4 text-slate-400 hover:text-slate-600 font-medium text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <h2 className="font-display font-bold text-2xl text-center text-brasil-blue mb-8">
          BOLÕES DISPONÍVEIS
        </h2>
        
        {boloes.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            Nenhum bolão aberto no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {boloes.map((bolao) => (
              <div key={bolao.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden relative animate-slide-up">
                <div className="p-6 text-center">
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{bolao.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">
                    {bolao.participantsCount} participantes
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Valor da Entrada</p>
                    <p className="font-bold text-3xl text-brasil-green">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bolao.entryFee)}
                    </p>
                  </div>
                  <Link 
                    href={`/boloes/${bolao.id}`} 
                    className="block w-full py-4 bg-brasil-blue hover:bg-brasil-blue-light text-white font-bold rounded-xl shadow-lg transition-colors text-lg"
                  >
                    Entrar no Bolão
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
