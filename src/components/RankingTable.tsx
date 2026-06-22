export interface RankingEntry {
  id: string;
  position: number;
  name: string;
  points: number;
  exactMatches: number;
}

interface RankingTableProps {
  entries: RankingEntry[];
}

export function RankingTable({ entries }: RankingTableProps) {
  return (
    <div className="overflow-x-auto glass-card rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brasil-blue uppercase tracking-wider">
              Pos
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brasil-blue uppercase tracking-wider">
              Participante
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-brasil-blue uppercase tracking-wider">
              Placares Exatos
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-brasil-blue uppercase tracking-wider">
              Pontos
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/50 divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-white/80 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-display font-bold text-lg w-8 text-center">
                    {entry.position === 1 && <span className="medal-gold text-2xl">🥇</span>}
                    {entry.position === 2 && <span className="medal-silver text-2xl">🥈</span>}
                    {entry.position === 3 && <span className="medal-bronze text-2xl">🥉</span>}
                    {entry.position > 3 && <span className="text-gray-500">{entry.position}º</span>}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{entry.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {entry.exactMatches}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-brasil-green/10 text-brasil-green-dark">
                  {entry.points} pts
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
