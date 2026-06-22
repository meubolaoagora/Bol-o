"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const handleBiometricLogin = async () => {
    setError("");
    setBiometricLoading(true);
    try {
      // 1. Get email
      const emailInput = document.getElementById("email-address") as HTMLInputElement;
      const email = emailInput?.value;

      if (!email) {
        setError("Digite seu e-mail primeiro para usar o Face ID/Digital.");
        setBiometricLoading(false);
        return;
      }

      // 2. Fetch options
      const res = await fetch(`/api/auth/webauthn/authenticate?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error("Erro ao obter opções de biometria. Você já a configurou no Perfil?");
      }
      const options = await res.json();

      // 3. Authenticate with browser
      const authResp = await startAuthentication(options);

      // 4. Verify with NextAuth
      const signRes = await signIn("credentials", {
        email,
        webauthnResponse: JSON.stringify(authResp),
        redirect: false,
      });

      if (signRes?.error) {
        setError(signRes.error);
      } else {
        const pRes = await fetch("/api/perfil");
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.role === "ADMIN") {
            router.push("/admin/dashboard");
            router.refresh();
            return;
          }
        }
        router.push("/boloes");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha no reconhecimento biométrico.");
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          try {
            const pRes = await fetch("/api/perfil");
            if (pRes.ok) {
              const pData = await pRes.json();
              if (pData.role === "ADMIN") {
                router.push("/admin/dashboard");
                router.refresh();
                return;
              }
            }
          } catch (e) {}
          router.push("/boloes");
          router.refresh();
        }
      } else {
        const name = formData.get("name") as string;
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        
        if (res.ok) {
          const signRes = await signIn("credentials", { email, password, redirect: false });
          if (!signRes?.error) {
            router.push("/boloes");
            router.refresh();
          } else {
            setError(signRes.error);
          }
        } else {
          const data = await res.json();
          setError(data.error || "Erro ao cadastrar.");
        }
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-brasil-blue rounded-b-[50%] scale-150 -translate-y-1/2 opacity-10"></div>
        
        <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl relative z-10 shadow-xl border-t-4 border-t-brasil-yellow">
          <div>
            <h2 className="mt-2 text-center font-display font-bold text-4xl text-brasil-blue">
              {isLogin ? "ENTRAR NO JOGO" : "CRIAR CONTA"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isLogin ? "Ou " : "Já tem conta? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-brasil-green hover:text-brasil-green-dark transition-colors"
              >
                {isLogin ? "cadastre-se agora" : "faça login aqui"}
              </button>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl text-sm text-center">{error}</div>}
            <div className="rounded-md shadow-sm space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">Nome Completo</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brasil-green focus:border-brasil-green sm:text-sm transition-all"
                    placeholder="Nome Completo"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email-address" className="sr-only">Email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brasil-green focus:border-brasil-green sm:text-sm transition-all"
                  placeholder="Seu melhor e-mail"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required={!isLogin} // Not strictly required for biometric login
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brasil-green focus:border-brasil-green sm:text-sm transition-all"
                  placeholder="Senha secreta"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={biometricLoading || loading}
                  className="w-full flex justify-center py-3 px-4 border-2 border-brasil-blue text-sm font-bold rounded-xl text-brasil-blue bg-white hover:bg-gray-50 focus:outline-none transition-all shadow-sm disabled:opacity-50"
                >
                  <span className="mr-2">👤</span>
                  {biometricLoading ? "Reconhecendo..." : "Entrar com Face ID / Digital"}
                </button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 text-xs uppercase">Ou use sua senha</span>
                  </div>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brasil-green focus:ring-brasil-green border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-brasil-blue hover:text-brasil-blue-light">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brasil-green hover:bg-brasil-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brasil-green transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLogin ? "⚽" : "📝"}
                </span>
                {loading ? "Aguarde..." : (isLogin ? "Entrar em Campo" : "Confirmar Escalação")}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 rounded-full">Protegido por SSL</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
