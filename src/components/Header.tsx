"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-brasil-blue text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-display font-bold text-2xl text-brasil-yellow tracking-wider">
              BOLÃO DA GALERA <span className="text-white">⚽</span>
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
            <Link href="/auth" className="btn-brasil-yellow px-4 py-2 text-sm">
              Entrar / Cadastrar
            </Link>
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
            <Link href="/auth" className="block px-3 py-2 text-base font-bold text-brasil-yellow">
              Entrar / Cadastrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
