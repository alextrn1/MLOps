import type { IncidentStatus } from "@mlops/contracts";
import { AppIcon, DelayedLoadingState as LoadingState, EmptyState, ErrorState } from "@mlops/ui";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { monitoringApi } from "../api";
import { IncidentStateIcon, IncidentStatusBadge } from "../components/IncidentVisuals";
import { formatDetectedShort } from "../format";
import { useApiResource } from "../useApiResource";

type Filter = "all" | "open" | "resolved";
const filters: Array<{ id: Filter; label: string }> = [{ id: "all", label: "Все" }, { id: "open", label: "Открытые" }, { id: "resolved", label: "Решённые" }];

export function MonitoringRegistryPage() {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState<Filter>("all");
  const { data, error, loading, retry } = useApiResource(() => monitoringApi.listIncidents(), []);
  const visible = useMemo(() => (data ?? []).filter((incident) => {
    const matchesFilter = filter === "all" || filter === "resolved" && incident.status === "resolved" || filter === "open" && incident.status !== "resolved";
    return matchesFilter && `${incident.title} ${incident.description} ${incident.typeLabel} ${incident.deployment.name}`.toLowerCase().includes(query.trim().toLowerCase());
  }), [data, filter, query]);

  return <section className="monitoring-page monitoring-registry">
    <header className="monitoring-page-header"><h1>Мониторинг</h1><p>Инциденты с продакшн-окружения, алерты и обратная связь</p></header>
    <div className="monitoring-toolbar"><label className="monitoring-search"><AppIcon name="search" size={19} aria-hidden /><input aria-label="Поиск по инцидентам" placeholder="Поиск по инцидентам..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="monitoring-filters" aria-label="Фильтр инцидентов">{filters.map((item) => <button type="button" key={item.id} className={filter === item.id ? `is-active is-active--${item.id}` : ""} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div></div>
    {loading ? <div className="monitoring-state-card"><LoadingState label="Загрузка инцидентов…" /></div> : error ? <div className="monitoring-state-card"><ErrorState title="Не удалось загрузить инциденты" description="Проверьте API и повторите попытку." onRetry={retry} /></div> : visible.length === 0 ? <div className="monitoring-state-card"><EmptyState title="Инциденты не найдены" description="Измените поисковый запрос или выбранный фильтр." /></div> : <div className="monitoring-table-wrap"><table className="monitoring-table"><thead><tr><th aria-label="Серьёзность" /><th>Инцидент</th><th>Тип</th><th>Deployment</th><th>Статус</th><th>Обнаружен</th></tr></thead><tbody>{visible.map((incident) => <tr key={incident.id} className={incident.status === "resolved" ? "is-resolved" : ""}><td className={`monitoring-table__icon monitoring-table__icon--${incident.status === "resolved" ? "resolved" : incident.severity}`}><IncidentStateIcon incident={incident} size={19} /></td><td className="monitoring-table__incident"><Link to={`/monitoring/${incident.id}`}>{incident.title}</Link><p>{incident.description}</p></td><td><span className="monitoring-type-label">{incident.typeLabel}</span></td><td><Link className="monitoring-deployment-link" to={`/deployments/${incident.deployment.id}`}>{incident.deployment.name}</Link></td><td><IncidentStatusBadge status={incident.status as IncidentStatus} /></td><td className="monitoring-table__detected">{formatDetectedShort(incident.detectedAt)}</td></tr>)}</tbody></table></div>}
  </section>;
}
