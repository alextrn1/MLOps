import { AppIcon, Button, DelayedLoadingState as LoadingState, ErrorState, Notice } from "@mlops/ui";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isIncidentNotFound, monitoringApi } from "../api";
import { IncidentStateIcon, IncidentStatusBadge } from "../components/IncidentVisuals";
import { formatDateTime } from "../format";
import { useApiResource } from "../useApiResource";
import { IncidentNotFoundPage } from "./IncidentNotFoundPage";

type Action = "acknowledge" | "resolve" | null;
export function IncidentDetailsPage() {
  const { incidentId = "" } = useParams(); const resource = useApiResource(() => monitoringApi.getIncident(incidentId), [incidentId]);
  const [action, setAction] = useState<Action>(null); const [actionError, setActionError] = useState(""); const [success, setSuccess] = useState("");
  if (resource.loading) return <section className="monitoring-page"><div className="monitoring-state-card"><LoadingState label="Загрузка инцидента…" /></div></section>;
  if (resource.error && isIncidentNotFound(resource.error)) return <IncidentNotFoundPage />;
  if (resource.error || !resource.data) return <section className="monitoring-page"><div className="monitoring-state-card"><ErrorState title="Не удалось загрузить инцидент" description="Проверьте API и повторите попытку." onRetry={resource.retry} /></div></section>;
  const incident = resource.data;
  const runAction = async (nextAction: Exclude<Action, null>) => { setAction(nextAction); setActionError(""); setSuccess(""); try { const updated = nextAction === "acknowledge" ? await monitoringApi.acknowledgeIncident(incident.id) : await monitoringApi.resolveIncident(incident.id); resource.setData(updated); setSuccess(nextAction === "acknowledge" ? "Инцидент взят в работу" : "Инцидент отмечен как решённый"); } catch { setActionError("Не удалось изменить статус инцидента."); } finally { setAction(null); } };

  return <section className="monitoring-page incident-detail">
    <header className="incident-detail-header"><Link to="/monitoring" aria-label="Назад к мониторингу"><AppIcon name="arrowLeft" size={23} aria-hidden /></Link><span className={`incident-detail-icon incident-detail-icon--${incident.status === "resolved" ? "resolved" : incident.severity}`}><IncidentStateIcon incident={incident} size={25} /></span><div><h1>{incident.title}</h1><div className="incident-detail-meta"><span className="incident-code">{incident.type}</span><IncidentStatusBadge status={incident.status} /><span className="incident-detected"><AppIcon name="clock" size={15} aria-hidden />Обнаружен: {formatDateTime(incident.detectedAt)}</span></div></div></header>
    {actionError ? <Notice tone="error">{actionError}</Notice> : success ? <Notice>{success}</Notice> : null}
    <article className="incident-description-card"><h2>Описание инцидента</h2><p>{incident.description}</p><div className="incident-metric"><div><span>Ключевая метрика</span><strong>{incident.metric.label}</strong></div><div><span>Зафиксировано</span><strong className={`incident-metric-value incident-metric-value--${incident.metric.tone}`}>{incident.metric.formattedValue}</strong></div><div><span>Порог срабатывания</span><strong>{incident.metric.formattedThreshold}</strong></div></div></article>
    <div className="incident-detail-bottom"><article className="incident-environment-card"><h2>Детали среды</h2><div><span><AppIcon name="server" size={15} aria-hidden />Эндпоинт</span><a href={`/deployments/${incident.deployment.id}`}>{incident.deployment.url}</a><b>{incident.deployment.environment}</b></div><div><span>Проект</span><a href={`/projects/${incident.project.id}`}>{incident.project.name}</a></div></article><article className="incident-actions-card"><h2>Действия</h2>{incident.status === "resolved" ? <div className="incident-closed"><div><AppIcon name="success" size={20} aria-hidden />Инцидент закрыт</div><span>Кем закрыт</span><strong>{incident.resolvedBy}</strong><span>Время закрытия</span><strong>{incident.resolvedAt ? formatDateTime(incident.resolvedAt) : "—"}</strong></div> : <div className="incident-action-buttons">{incident.status === "open" ? <Button className="incident-acknowledge" type="button" disabled={action !== null} onClick={() => runAction("acknowledge")}>{action === "acknowledge" ? "Сохранение…" : "Взять в работу (Acknowledge)"}</Button> : null}<Button className="incident-resolve" type="button" disabled={action !== null} onClick={() => runAction("resolve")}>{action === "resolve" ? "Сохранение…" : "Отметить как решённый"}</Button><Button variant="secondary" type="button">Перейти в Grafana / Логи</Button></div>}</article></div>
  </section>;
}
