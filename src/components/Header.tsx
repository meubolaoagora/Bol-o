"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="bg-brasil-blue text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-2xl text-brasil-yellow tracking-wider">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full border-2 border-white/20 animate-[breathe_3s_ease-in-out_infinite]" />
              <span className="hidden sm:inline">BOLÃO DA GALERA</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-brasil-yellow transition-colors font-medium">
              Início
            </Link>
            <Link href="/boloes" className="text-white hover:text-brasil-yellow transition-colors font-medium">
              Bolões
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/perfil" className="flex items-center space-x-2 text-white hover:text-brasil-yellow transition-colors">
                  <span className="text-xl">👤</span>
                  <span className="font-bold">{session.user?.name?.split(" ")[0]}</span>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm text-red-300 hover:text-red-400 font-bold"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link href="/auth" className="btn-brasil-yellow px-4 py-2 text-sm">
                Entrar / Cadastrar
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brasil-yellow focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brasil-blue-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-white hover:text-brasil-yellow">
              Início
            </Link>
            <Link href="/boloes" className="block px-3 py-2 text-base font-medium text-white hover:text-brasil-yellow">
              Bolões
            </Link>
            {session ? (
              <>
                <Link href="/perfil" className="block px-3 py-2 text-base font-bold text-brasil-yellow">
                  Meu Perfil
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="block px-3 py-2 text-base font-bold text-red-400 w-full text-left"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link href="/auth" className="block px-3 py-2 text-base font-bold text-brasil-yellow">
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
