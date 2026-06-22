"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function CreateBolao() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [defaultPixKey, setDefaultPixKey] = useState("");

  useEffect(() => {
    // Fetch admin profile to get default PIX Key
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/perfil");
        if (res.ok) {
          const data = await res.json();
          if (data.pixKey) setDefaultPixKey(data.pixKey);
        }
      } catch (e) {
        console.error("Failed to fetch admin profile");
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError("A imagem do QR Code deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setQrBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      quotaValue: parseFloat(formData.get("quotaValue") as string),
      orgFeePercent: parseFloat(formData.get("orgFeePercent") as string),
      registrationDeadline: formData.get("registrationDeadline") ? new Date(formData.get("registrationDeadline") as string).toISOString() : new Date().toISOString(),
      pixKey: formData.get("pixKey") || "Não informada",
      pixQrCodePath: qrBase64,
      exactScorePoints: 10,
      winnerDiffPoints: 7,
      winnerOnlyPoints: 5,
      wrongPoints: 0,
      prizeRules: [
        { position: 1, percentage: 60 },
        { position: 2, percentage: 30 },
        { position: 3, percentage: 10 }
      ]
    };

    try {
      const res = await fetch("/api/boloes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Erro ao criar bolão");
      }
    } catch (err) {
      setError("Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-800">&larr; Voltar</Link>
          <h1 className="font-display font-bold text-3xl text-slate-800">Criar Novo Bolão</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Bolão</label>
              <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: Bolão da Firma 2026" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Cota (R$)</label>
                <input name="quotaValue" type="number" step="0.01" min="0" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="50.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Organização (%)</label>
                <input name="orgFeePercent" type="number" step="0.1" min="0" max="100" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="10" defaultValue="10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chave PIX (Copia e Cola) para Pagamentos</label>
              <input name="pixKey" type="text" defaultValue={defaultPixKey} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Sua chave PIX (CPF, Email, Telefone ou Aleatória)" />
              <p className="text-xs text-slate-500 mt-1">Os participantes verão esta chave para realizar o pagamento.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do QR Code do PIX (Opcional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" 
              />
              <p className="text-xs text-slate-500 mt-1">Envie a imagem do seu QR Code gerado pelo banco (Máx: 2MB).</p>
              {qrBase64 && (
                <div className="mt-2 w-32 h-32 bg-gray-100 rounded-lg p-2 border border-gray-200">
                  <img src={qrBase64} alt="QR Code Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Limite para Inscrição e Pagamento</label>
              <input name="registrationDeadline" type="datetime-local" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" disabled={loading} className="w-full bg-brasil-green hover:bg-brasil-green-dark text-white font-bold py-3 rounded-lg shadow transition-colors disabled:opacity-50">
              {loading ? "Salvando..." : "Criar Bolão Oficial"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
