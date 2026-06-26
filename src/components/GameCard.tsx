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
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.99] transition-transform touch-manipulation">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue"></div>

      {/* Header row: date + status */}
      <div className="flex justify-between items-center mb-3 pt-1">
        <span className="text-[11px] font-semibold text-gray-500 uppercase">
          {gameDate} • {game.stadium}
        </span>
        <StatusBadge status={game.status} />
      </div>

      {/* Main row: Team A — Score — Team B */}
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden border border-gray-200 flex-shrink-0">
            {game.homeTeam.flagUrl ? (
              <img src={game.homeTeam.flagUrl} alt={game.homeTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-[10px] sm:text-xs text-gray-400">{game.homeTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-center text-[11px] sm:text-sm leading-tight truncate w-full">{game.homeTeam.name}</span>
        </div>

        {/* Score Inputs */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {readOnly ? (
            <div className="score-display-mobile">{userHomeScore ?? "-"}</div>
          ) : (
            <ScoreInput value={userHomeScore} onChange={handleHomeChange} disabled={game.status !== "scheduled"} />
          )}

          <span className="font-display font-bold text-lg text-gray-300 mx-0.5">X</span>

          {readOnly ? (
            <div className="score-display-mobile">{userAwayScore ?? "-"}</div>
          ) : (
            <ScoreInput value={userAwayScore} onChange={handleAwayChange} disabled={game.status !== "scheduled"} />
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden border border-gray-200 flex-shrink-0">
            {game.awayTeam.flagUrl ? (
              <img src={game.awayTeam.flagUrl} alt={game.awayTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-[10px] sm:text-xs text-gray-400">{game.awayTeam.code}</span>
            )}
          </div>
          <span className="font-bold text-center text-[11px] sm:text-sm leading-tight truncate w-full">{game.awayTeam.name}</span>
        </div>
      </div>
      
      {/* Official Score (if game is finished or live) */}
      {(game.status === "finished" || game.status === "live") && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-center items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">Placar Oficial:</span>
          <span className="font-bold bg-gray-100 px-2 py-0.5 rounded">
            {game.homeScore} x {game.awayScore}
          </span>
        </div>
      )}
    </div>
  );
}
