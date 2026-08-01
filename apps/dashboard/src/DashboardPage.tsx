import { Card, DelayedLoadingState, EmptyState, ErrorState, useCachedResource } from "@mlops/ui";
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
  const { data, error, loading, retry } = useCachedResource<DashboardData>(
    "dashboard:summary",
    async () => {
      const [summary, activity, incidents] = await Promise.all([dashboardApi.getSummary(), dashboardApi.getActivity(), dashboardApi.getIncidents()]);
      return { summary, activity, incidents };
    },
    []
  );

  const isEmpty = data && data.summary.metrics.length === 0 && data.activity.deployments.length === 0 && data.incidents.items.length === 0;

  return (
    <div className="dashboard-page">
      <h1>Дашборд платформы</h1>
      {error ? <Card><ErrorState title="Не удалось загрузить дашборд" description={error.message} onRetry={retry} /></Card> : null}
      {!error && !data ? <Card><DelayedLoadingState loading={loading} label="Загружаем сводку платформы…" /></Card> : null}
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
