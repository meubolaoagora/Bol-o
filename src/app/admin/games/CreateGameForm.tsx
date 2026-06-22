"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGameForm({ bolaoId }: { bolaoId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      bolaoId,
      teamA: formData.get("teamA"),
      teamB: formData.get("teamB"),
      phase: formData.get("phase"),
      matchDate: new Date(formData.get("matchDate") as string).toISOString()
    };

    try {
      const res = await fetch("/api/jogos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Erro ao criar jogo");
      }
    } catch (err) {
      setError("Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Time A (Mandante)</label>
        <input name="teamA" type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: Brasil" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Time B (Visitante)</label>
        <input name="teamB" type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: Argentina" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Fase / Rodada</label>
        <input name="phase" type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: Oitavas de Final" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Data e Hora do Jogo</label>
        <input name="matchDate" type="datetime-local" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-brasil-blue hover:bg-blue-800 text-white font-bold py-2 rounded-lg shadow transition-colors disabled:opacity-50 text-sm mt-2">
        {loading ? "Adicionando..." : "Adicionar Jogo"}
      </button>
    </form>
  );
}
