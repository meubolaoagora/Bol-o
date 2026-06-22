"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bolao } from "@prisma/client";

export default function EditBolaoForm({ bolao }: { bolao: Bolao }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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
      pixQrCodePath: formData.get("pixQrCodePath") || null,
    };

    try {
      const res = await fetch(`/api/boloes/${bolao.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Erro ao atualizar bolão");
      }
    } catch (err) {
      setError("Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este bolão? Esta ação é irreversível.")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/boloes/${bolao.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Erro ao excluir bolão");
        setDeleting(false);
      }
    } catch (err) {
      setError("Falha na conexão.");
      setDeleting(false);
    }
  };

  // Format date for datetime-local input
  const dateObj = new Date(bolao.registrationDeadline);
  const tzoffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-800">&larr; Voltar</Link>
          <h1 className="font-display font-bold text-3xl text-slate-800">Editar Bolão</h1>
        </div>
        <button 
          onClick={handleDelete} 
          disabled={deleting}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {deleting ? "Excluindo..." : "🗑️ Excluir Bolão"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Bolão</label>
            <input name="name" type="text" defaultValue={bolao.name} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Cota (R$)</label>
              <input name="quotaValue" type="number" step="0.01" min="0" defaultValue={bolao.quotaValue} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Organização (%)</label>
              <input name="orgFeePercent" type="number" step="0.1" min="0" max="100" defaultValue={bolao.orgFeePercent} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chave PIX (Copia e Cola) para Pagamentos</label>
            <input name="pixKey" type="text" defaultValue={bolao.pixKey} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-500 mt-1">Apenas atualizar se a chave PIX mudar.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link/URL do QR Code do PIX (Opcional)</label>
            <input name="pixQrCodePath" type="url" defaultValue={bolao.pixQrCodePath || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://exemplo.com/meu-qrcode.png" />
            <p className="text-xs text-slate-500 mt-1">Cole aqui o link direto da imagem do seu QR Code gerado no banco.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Limite para Inscrição e Pagamento</label>
            <input name="registrationDeadline" type="datetime-local" defaultValue={localISOTime} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition-colors disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
