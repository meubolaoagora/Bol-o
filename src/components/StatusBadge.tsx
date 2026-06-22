export type StatusType = "open" | "closed" | "finished" | "pending" | "confirmed" | "scheduled" | "live";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusMap: Record<StatusType, { defaultLabel: string; className: string }> = {
  open: { defaultLabel: "Aberto", className: "badge-open" },
  closed: { defaultLabel: "Fechado", className: "badge-closed" },
  finished: { defaultLabel: "Finalizado", className: "badge-finished" },
  pending: { defaultLabel: "Pendente", className: "badge-pending" },
  confirmed: { defaultLabel: "Confirmado", className: "badge-confirmed" },
  scheduled: { defaultLabel: "Agendado", className: "badge-scheduled" },
  live: { defaultLabel: "Ao Vivo", className: "badge-live" },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusMap[status];

  return (
    <span className={`badge ${config.className}`}>
      {status === "live" && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-1"></span>}
      {label || config.defaultLabel}
    </span>
  );
}
