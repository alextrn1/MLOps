import type { IncidentDto, IncidentStatus } from "@mlops/contracts";
import { AppIcon } from "@mlops/ui";

export function IncidentStateIcon({ incident, size = 20 }: { incident: Pick<IncidentDto, "severity" | "status">; size?: number }) {
  if (incident.status === "resolved") return <AppIcon name="success" size={size} aria-hidden />;
  return <AppIcon name={incident.severity === "warning" ? "triangleAlert" : "alert"} size={size} aria-hidden />;
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const label = status === "open" ? "Открыт" : status === "acknowledged" ? "В работе" : "Решён";
  return <span className={`monitoring-status monitoring-status--${status}`}>{label}</span>;
}
