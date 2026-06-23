"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePageClient({ boloes }: { boloes: any[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5s splash screen
    return () => clearTimeout(timer);
  }, []);

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
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
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
