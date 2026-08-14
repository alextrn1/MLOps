import { AppIcon, Button, DelayedLoadingState, ErrorState, invalidateCachedResources, Notice, StatusBadge } from "@mlops/ui";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deploymentsApi, isDeploymentNotFound } from "../api";
import { DeploymentMetricsChart } from "../components/DeploymentMetricsChart";
import { environmentLabel } from "../format";
import { useApiResource } from "../useApiResource";
import { DeploymentNotFoundPage } from "./DeploymentNotFoundPage";

export function DeploymentDetailsPage() {
  const { deploymentId = "" } = useParams();
  const [restarting, setRestarting] = useState(false);
  const [success, setSuccess] = useState("");
  const [restartError, setRestartError] = useState("");
  const resource = useApiResource(async () => {
    const [deployment, metrics, events] = await Promise.all([deploymentsApi.getDeployment(deploymentId), deploymentsApi.getMetrics(deploymentId), deploymentsApi.getEvents(deploymentId)]);
    return { deployment, metrics, events };
  }, [deploymentId]);

  if (resource.loading) return <section className="deployments-page"><div className="deployments-state-card"><DelayedLoadingState loading label="Загрузка развёртывания…" /></div></section>;
  if (resource.error && isDeploymentNotFound(resource.error)) return <DeploymentNotFoundPage />;
  if (resource.error || !resource.data) return <section className="deployments-page"><div className="deployments-state-card"><ErrorState title="Не удалось загрузить развёртывание" description="Проверьте API и повторите попытку." onRetry={resource.retry} /></div></section>;
  const { deployment, metrics, events } = resource.data;

  const restart = async () => {
    setRestarting(true); setSuccess(""); setRestartError("");
    try {
      await deploymentsApi.restartDeployment(deployment.id);
      invalidateCachedResources("deployments:[]", `deployments:${JSON.stringify([deployment.id])}`);
      setSuccess("Развёртывание успешно перезапущено");
      resource.retry();
    } catch { setRestartError("Не удалось перезапустить развёртывание. Повторите попытку."); }
    finally { setRestarting(false); }
  };

  return <section className="deployments-page deployment-detail">
    <header className="deployment-detail-header">
      <Link className="deployment-back" to="/deployments" aria-label="Назад к развёртываниям"><AppIcon name="arrowLeft" size={23} aria-hidden /></Link>
      <div className="deployment-detail-heading"><div><h1>{deployment.name}</h1><StatusBadge tone="success">{deployment.status}</StatusBadge><StatusBadge tone={deployment.environment === "production" ? "primary" : "neutral"}>{environmentLabel(deployment.environment)}</StatusBadge></div><a className="deployment-url" href={deployment.url} target="_blank" rel="noreferrer"><AppIcon name="externalLink" size={14} aria-hidden />{deployment.url}</a></div>
      <Button variant="secondary" onClick={restart} disabled={restarting}><AppIcon name="refresh" size={17} aria-hidden />{restarting ? "Перезапуск…" : "Рестарт"}</Button>
    </header>
    {success ? <Notice>{success}</Notice> : null}
    {restartError ? <Notice tone="error">{restartError}</Notice> : null}
    <div className="deployment-detail-grid">
      <article className="deployment-metrics-card">
        <h2><AppIcon name="activity" size={26} aria-hidden />Метрики (Последние 24 часа)</h2>
        <DeploymentMetricsChart metrics={metrics} />
        <div className="deployment-summary-metrics"><div><span>Ср. Latency (p95)</span><strong className="metric-latency">{metrics.averageLatencyP95Ms.toFixed(1)} ms</strong></div><div><span>Трафик</span><strong className="metric-traffic">{metrics.trafficPercent}%</strong></div><div><span>Error Rate (5xx)</span><strong className="metric-errors">{metrics.errorRatePercent.toFixed(2)}%</strong></div></div>
      </article>
      <aside className="deployment-side-column">
        <article className="deployment-side-card deployment-relations"><h2>Связи</h2><div><span>Проект</span><Link to={`/projects/${deployment.project.id}`}>{deployment.project.name}</Link></div><div><span>Модель</span><Link to={`/models/${deployment.model.id}`}>{deployment.model.name}</Link><b className="deployment-version">{deployment.modelVersion}</b></div></article>
        <article className="deployment-side-card deployment-events"><h2><AppIcon name="alert" size={23} aria-hidden />События</h2>{events.length ? <div className="deployment-events-list">{events.map((event) => event.monitoringEventId ? <Link to={`/monitoring/${event.monitoringEventId}`} key={event.id}><i aria-hidden /><strong>{event.title}</strong><span>{new Date(`${event.occurredAt}T00:00:00`).toLocaleDateString("ru-RU")} • {event.type}</span></Link> : <div className="deployment-event-static" key={event.id}><strong>{event.title}</strong><span>{new Date(`${event.occurredAt}T00:00:00`).toLocaleDateString("ru-RU")} • {event.type}</span></div>)}</div> : <p className="deployment-events-empty">Инцидентов не найдено</p>}</article>
      </aside>
    </div>
  </section>;
}
