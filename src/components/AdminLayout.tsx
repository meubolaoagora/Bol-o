"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="font-display font-bold text-2xl tracking-wider">
            Bolão <span className="text-brasil-yellow">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700 transition-colors">
            <span className="text-xl">📊</span> Dashboard
          </Link>
          <Link href="/admin/boloes/create" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span className="text-xl">🏆</span> Novo Bolão
          </Link>
          <Link href="/admin/games" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span className="text-xl">⚽</span> Jogos
          </Link>
          <Link href="/admin/results" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span className="text-xl">📝</span> Resultados
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span className="text-xl">👥</span> Usuários
          </Link>
          <Link href="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span className="text-xl">👤</span> Meu Perfil
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:hidden relative z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <Link href="/admin/dashboard" className="font-display font-bold text-xl text-slate-900">
              Bolão <span className="text-brasil-green">Admin</span>
            </Link>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-red-600 font-bold">Sair</button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-slate-800 text-white absolute top-16 left-0 w-full z-20 shadow-lg border-b border-slate-700">
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 border-b border-slate-700 hover:bg-slate-700">📊 Dashboard</Link>
            <Link href="/admin/boloes/create" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 border-b border-slate-700 hover:bg-slate-700">🏆 Novo Bolão</Link>
            <Link href="/admin/games" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 border-b border-slate-700 hover:bg-slate-700">⚽ Jogos</Link>
            <Link href="/admin/results" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 border-b border-slate-700 hover:bg-slate-700">📝 Resultados</Link>
            <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 border-b border-slate-700 hover:bg-slate-700">👥 Usuários</Link>
            <Link href="/perfil" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 hover:bg-slate-700">👤 Meu Perfil</Link>
          </nav>
        )}
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
