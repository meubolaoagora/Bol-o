"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@prisma/client";

export default function UpdateResultForm({ game }: { game: Game }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const scoreA = parseInt(formData.get("scoreA") as string, 10);
    const scoreB = parseInt(formData.get("scoreB") as string, 10);
    const status = formData.get("status") as string;

    try {
      const res = await fetch(`/api/jogos/${game.id}/resultado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoreA, scoreB, status })
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Erro ao atualizar resultado");
      }
    } catch (err) {
      setError("Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex-1 w-full flex items-center justify-between">
        <div className="font-bold text-slate-800 text-lg w-1/3 text-right">{game.teamA}</div>
        
        <div className="flex gap-2 items-center justify-center px-4">
          <input 
            name="scoreA" 
            type="number" 
            min="0" 
            defaultValue={game.scoreA ?? ""} 
            required 
            className="w-16 h-12 text-center text-xl font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 font-bold">X</span>
          <input 
            name="scoreB" 
            type="number" 
            min="0" 
            defaultValue={game.scoreB ?? ""} 
            required 
            className="w-16 h-12 text-center text-xl font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="font-bold text-slate-800 text-lg w-1/3 text-left">{game.teamB}</div>
      </div>

      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        <select 
          name="status" 
          defaultValue={game.status} 
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
        >
          <option value="SCHEDULED">Agendado</option>
          <option value="LIVE">Ao Vivo</option>
          <option value="FINISHED">Finalizado (Recalcula)</option>
        </select>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Salvar"}
        </button>
      </div>

      {error && <div className="text-red-500 text-xs w-full mt-2 font-bold">{error}</div>}
      {success && <div className="text-green-600 text-xs w-full mt-2 font-bold">Placar e pontos atualizados!</div>}
    </form>
  );
}
