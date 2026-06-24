"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteGameButton({ gameId }: { gameId: number }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este jogo?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/jogos/${gameId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Erro ao deletar jogo.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleting}
      className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
    >
      {deleting ? "Deletando..." : "🗑️ Excluir"}
    </button>
  );
}
