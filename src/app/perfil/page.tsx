"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem não pode ter mais de 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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

  const handleRegisterBiometrics = async () => {
    setBioLoading(true);
    setMessage("");
    try {
      // 1. Get options
      const res = await fetch("/api/auth/webauthn/register");
      if (!res.ok) throw new Error("Erro ao gerar opções de biometria.");
      const options = await res.json();

      // 2. Start registration in browser
      const attResp = await startRegistration(options);

      // 3. Verify
      const verifyRes = await fetch("/api/auth/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attResp),
      });

      if (verifyRes.ok) {
        setMessage("Face ID / Digital ativado com sucesso! 🔒");
      } else {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Erro ao verificar biometria.");
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Erro inesperado ao cadastrar biometria.");
    } finally {
      setBioLoading(false);
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Foto de Perfil</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brasil-green outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brasil-blue file:text-white hover:file:bg-brasil-blue-light cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-1">Selecione uma imagem do seu PC/Celular (Max 2MB).</p>
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

            <div className="bg-slate-50 p-6 rounded-lg border border-gray-200 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-800">Segurança Avançada</h3>
                <p className="text-sm text-gray-600">Cadastre seu Face ID ou Impressão Digital para login rápido no futuro.</p>
              </div>
              <button
                type="button"
                onClick={handleRegisterBiometrics}
                disabled={bioLoading}
                className="bg-brasil-blue hover:bg-brasil-blue-light text-white font-bold py-2 px-6 rounded-lg shadow transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {bioLoading ? "Aguardando..." : "Cadastrar Face ID / Digital"}
              </button>
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
