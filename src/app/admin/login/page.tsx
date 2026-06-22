"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <header className="bg-slate-950 text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="font-display font-bold text-2xl text-slate-300 tracking-wider">
            BOLÃO DA GALERA <span className="text-brasil-yellow text-sm align-top ml-1">ADMIN</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Tech background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-xl relative z-10 shadow-2xl border border-slate-700">
          <div>
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-600">
              <span className="text-2xl">🛡️</span>
            </div>
            <h2 className="text-center font-display font-bold text-3xl text-white">
              ACESSO RESTRITO
            </h2>
            <p className="mt-2 text-center text-sm text-slate-400">
              Área exclusiva para administradores do sistema.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">Email Admin</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Email de Administrador"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Senha de Acesso"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all shadow-lg"
              >
                Autenticar Sistema
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                &larr; Voltar para o site principal
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-slate-950 py-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Sistema de Administração do Bolão da Galera
      </footer>
    </div>
  );
}
