import { AppIcon, Button, DelayedLoadingState as LoadingState, EmptyState, ErrorState, StatusBadge } from "@mlops/ui";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deploymentsApi } from "../api";
import { environmentLabel, formatDate } from "../format";
import { useApiResource } from "../useApiResource";

export function DeploymentsRegistryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data, error, loading, retry } = useApiResource(() => deploymentsApi.listDeployments(), []);
  const filtered = useMemo(() => (data ?? []).filter((deployment) => `${deployment.name} ${deployment.url} ${deployment.project.name} ${deployment.model.name}`.toLowerCase().includes(query.trim().toLowerCase())), [data, query]);

  return <section className="deployments-page deployments-registry">
    <header className="deployments-page-header">
      <div><h1>Развёртывания</h1><p>Управление продакшн и стейджинг эндпоинтами моделей</p></div>
      <Button onClick={() => navigate("/deployments/new")}><AppIcon name="plus" size={18} aria-hidden />Новый Deployment</Button>
    </header>
    <div className="deployments-search-panel"><label className="deployments-search"><AppIcon name="search" size={19} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по URL эндпоинта..." aria-label="Поиск по URL эндпоинта" /></label></div>
    {loading ? <div className="deployments-state-card"><LoadingState label="Загрузка развёртываний…" /></div> : error ? <div className="deployments-state-card"><ErrorState title="Не удалось загрузить развёртывания" description="Проверьте API и повторите попытку." onRetry={retry} /></div> : filtered.length === 0 ? <div className="deployments-state-card"><EmptyState title={query ? "Ничего не найдено" : "Развёртываний пока нет"} description={query ? "Измените поисковый запрос." : "Создайте первое развёртывание модели."} /></div> : <div className="deployment-list">
      {filtered.map((deployment) => <article className="deployment-list-card" key={deployment.id}>
        <div className={`deployment-list-card__icon deployment-list-card__icon--${deployment.environment}`}><AppIcon name="server" size={28} aria-hidden /></div>
        <div className="deployment-list-card__body">
          <div className="deployment-list-card__title"><Link to={`/deployments/${deployment.id}`}>{deployment.name}</Link><StatusBadge tone="success">{deployment.status === "active" ? "Active" : deployment.status}</StatusBadge><StatusBadge tone={deployment.environment === "production" ? "primary" : "neutral"}>{environmentLabel(deployment.environment)}</StatusBadge></div>
          <a className="deployment-url" href={deployment.url} target="_blank" rel="noreferrer"><AppIcon name="externalLink" size={14} aria-hidden />{deployment.url}</a>
          <div className="deployment-list-card__meta"><span>Проект: <Link to={`/projects/${deployment.project.id}`}>{deployment.project.name}</Link></span><span>Модель: <Link to={`/models/${deployment.model.id}`}>{deployment.model.name}</Link></span><span className="deployment-version">{deployment.modelVersion}</span><span>Трафик: {deployment.trafficPercent}%</span></div>
        </div>
        <div className="deployment-list-card__date"><span>Развёрнуто</span><strong>{formatDate(deployment.deployedAt)}</strong><span>{deployment.deployedBy}</span></div>
      </article>)}
    </div>}
  </section>;
}
