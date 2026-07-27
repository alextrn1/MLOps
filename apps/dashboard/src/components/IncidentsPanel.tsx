import { AppIcon, Card, EmptyState } from "@mlops/ui";
import { Link } from "react-router-dom";
import type { DashboardIncidentDto } from "../api";

export function IncidentsPanel({ incidents }: { incidents: DashboardIncidentDto[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="dashboard-panel__header"><h2>Открытые инциденты мониторинга</h2></div>
      <div className="dashboard-panel__body">
        {incidents.length === 0 ? <EmptyState title="Нет открытых инцидентов" description="Критичные события мониторинга здесь не обнаружены." /> : incidents.map((incident) => (
          <article className="incident-row" key={incident.id}>
            <AppIcon className={`incident-row__icon incident-row__icon--${incident.severity}`} name="alert" size={21} strokeWidth={2} aria-hidden />
            <div className="incident-row__content">
              <div className="incident-row__title"><Link to={`/monitoring/${incident.id}`}>{incident.title}</Link><time>{incident.detectedAt}</time></div>
              <p>{incident.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
