import { Card, EmptyState, ErrorState, LoadingState } from "@mlops/ui";
import { useEffect, useState } from "react";
import { dashboardApi, type DashboardActivityDto, type DashboardIncidentsDto, type DashboardSummaryDto } from "./api";
import { DeploymentsPanel } from "./components/DeploymentsPanel";
import { IncidentsPanel } from "./components/IncidentsPanel";
import { MetricCard } from "./components/MetricCard";

interface DashboardData {
  summary: DashboardSummaryDto;
  activity: DashboardActivityDto;
  incidents: DashboardIncidentsDto;
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setData(null);
    setError(null);

    Promise.all([dashboardApi.getSummary(), dashboardApi.getActivity(), dashboardApi.getIncidents()])
      .then(([summary, activity, incidents]) => { if (active) setData({ summary, activity, incidents }); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Неизвестная ошибка API"); });

    return () => { active = false; };
  }, [reloadKey]);

  const isEmpty = data && data.summary.metrics.length === 0 && data.activity.deployments.length === 0 && data.incidents.items.length === 0;

  return (
    <div className="dashboard-page">
      <h1>Дашборд платформы</h1>
      {error ? <Card><ErrorState title="Не удалось загрузить дашборд" description={error} onRetry={() => setReloadKey((value) => value + 1)} /></Card> : null}
      {!error && !data ? <Card><LoadingState label="Загружаем сводку платформы…" /></Card> : null}
      {!error && isEmpty ? <Card><EmptyState title="Данных пока нет" description="Сводные показатели появятся после добавления ресурсов платформы." /></Card> : null}
      {!error && data && !isEmpty ? (
        <>
          <section className="metrics-grid" aria-label="Ключевые показатели">{data.summary.metrics.map((metric) => <MetricCard key={metric.id} metric={metric} />)}</section>
          <section className="dashboard-panels"><IncidentsPanel incidents={data.incidents.items} /><DeploymentsPanel deployments={data.activity.deployments} /></section>
        </>
      ) : null}
    </div>
  );
}
