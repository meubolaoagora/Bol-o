"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WhatsAppForm({ initialPhone }: { initialPhone: string }) {
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      if (res.ok) {
        setMessage("✅ Número de WhatsApp salvo com sucesso!");
        router.refresh();
      } else {
        setMessage("❌ Falha ao salvar número.");
      }
    } catch (error) {
      setMessage("❌ Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Número do WhatsApp (com DDD)
        </label>
        <input 
          type="text" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex: 11999999999"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brasil-green outline-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          Coloque apenas números. Exemplo: 11987654321
        </p>
      </div>

      <button 
        type="submit" 
        disabled={saving}
        className="btn-brasil w-full flex justify-center items-center py-3 text-lg mt-4 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar Número de WhatsApp"}
      </button>
    </form>
  );
}
