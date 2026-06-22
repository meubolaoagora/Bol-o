"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    pixKey: "",
    photoUrl: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/perfil");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            pixKey: data.pixKey || "",
            photoUrl: data.photoUrl || ""
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage("Perfil atualizado com sucesso! 🎉");
      } else {
        setMessage("Erro ao atualizar o perfil.");
      }
    } catch (error) {
      setMessage("Falha na conexão.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl text-slate-500 font-bold">Carregando perfil...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="font-display font-bold text-4xl text-brasil-blue mb-8 text-center md:text-left">
          MEU PERFIL
        </h1>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b pb-8">
              <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-brasil-green overflow-hidden flex items-center justify-center relative">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-700 mb-1">Link da Foto de Perfil (URL)</label>
                <input 
                  type="url" 
                  name="photoUrl" 
                  value={formData.photoUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/minhafoto.jpg"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brasil-green outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Cole aqui o link direto para uma imagem sua.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brasil-green outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Chave PIX de Recebimento</label>
                <input 
                  type="text" 
                  name="pixKey" 
                  value={formData.pixKey}
                  onChange={handleChange}
                  placeholder="Seu CPF, Email ou Chave Aleatória"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brasil-green outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">O organizador precisará dessa chave para te transferir o prêmio caso você ganhe o bolão!</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col items-center">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 bg-brasil-green hover:bg-brasil-green-dark text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 text-lg"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
              
              {message && (
                <div className={`mt-4 font-bold text-sm ${message.includes("Erro") ? "text-red-500" : "text-brasil-green"}`}>
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
