"use client";

import { ScoreInput } from "./ScoreInput";
import { StatusBadge, StatusType } from "./StatusBadge";

export interface Team {
  id: string;
  name: string;
  flagUrl?: string;
  code: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  stadium: string;
  status: StatusType;
  homeScore?: number;
  awayScore?: number;
}

interface GameCardProps {
  game: Game;
  userHomeScore?: number;
  userAwayScore?: number;
  onScoreChange?: (gameId: string, homeScore: number, awayScore: number) => void;
  readOnly?: boolean;
}

export function GameCard({ game, userHomeScore, userAwayScore, onScoreChange, readOnly = false }: GameCardProps) {
  const handleHomeChange = (score: number) => {
    if (onScoreChange) onScoreChange(game.id, score, userAwayScore ?? 0);
  };

  const handleAwayChange = (score: number) => {
    if (onScoreChange) onScoreChange(game.id, userHomeScore ?? 0, score);
  };

  const gameDate = new Date(game.date).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue"></div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {gameDate} • {game.stadium}
        </div>
        <StatusBadge status={game.status} />
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden border-2 border-gray-200">
            {game.homeTeam.flagUrl ? (
              <img src={game.homeTeam.flagUrl} alt={game.homeTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-gray-400">{game.homeTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-center text-sm md:text-base">{game.homeTeam.name}</span>
        </div>

        {/* Score Inputs / Displays */}
        <div className="flex items-center gap-3">
          {readOnly ? (
            <div className="score-display">{userHomeScore ?? "-"}</div>
          ) : (
            <ScoreInput value={userHomeScore} onChange={handleHomeChange} disabled={game.status !== "scheduled"} />
          )}

          <span className="font-display font-bold text-2xl text-gray-300">X</span>

          {readOnly ? (
            <div className="score-display">{userAwayScore ?? "-"}</div>
          ) : (
            <ScoreInput value={userAwayScore} onChange={handleAwayChange} disabled={game.status !== "scheduled"} />
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden border-2 border-gray-200">
            {game.awayTeam.flagUrl ? (
              <img src={game.awayTeam.flagUrl} alt={game.awayTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-gray-400">{game.awayTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-center text-sm md:text-base">{game.awayTeam.name}</span>
        </div>
      </div>
      
      {/* Official Score (if game is finished or live) */}
      {(game.status === "finished" || game.status === "live") && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Placar Oficial:</span>
          <span className="font-bold bg-gray-100 px-3 py-1 rounded-md">
            {game.homeScore} x {game.awayScore}
          </span>
        </div>
      )}
    </div>
  );
}
