import Link from "next/link";
import { StatusBadge, StatusType } from "./StatusBadge";

export interface Bolao {
  id: string;
  name: string;
  owner: string;
  participantsCount: number;
  entryFee: number;
  prizePool: number;
  status: StatusType;
}

interface BolaoCardProps {
  bolao: Bolao;
}

export function BolaoCard({ bolao }: BolaoCardProps) {
  return (
    <Link href={`/boloes/${bolao.id}`} className="block group">
      <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-l-4 border-l-brasil-green relative overflow-hidden">
        {/* Hover accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-brasil-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="font-display font-bold text-xl text-brasil-blue group-hover:text-brasil-green-dark transition-colors">
              {bolao.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Organizado por {bolao.owner}</p>
          </div>
          <StatusBadge status={bolao.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Participantes</div>
            <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <span>👥</span> {bolao.participantsCount}
            </div>
          </div>
          <div className="bg-brasil-yellow/10 rounded-lg p-3">
            <div className="text-xs text-brasil-blue uppercase font-semibold mb-1">Taxa / Prêmio (Est.)</div>
            <div className="font-bold text-lg text-brasil-green-dark flex items-center gap-2">
              <span>🏆</span> R$ {bolao.prizePool.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
