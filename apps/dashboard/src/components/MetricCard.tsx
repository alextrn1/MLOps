import { AppIcon, Card, type AppIconName } from "@mlops/ui";
import type { DashboardMetricDto, MetricKind } from "../api";

const metricIcons: Record<MetricKind, AppIconName> = {
  "active-projects": "grid",
  models: "box",
  deployments: "server",
  "critical-alerts": "alert"
};

export function MetricCard({ metric }: { metric: DashboardMetricDto }) {
  const isCritical = metric.kind === "critical-alerts";
  return (
    <Card className={`metric-card${isCritical ? " metric-card--critical" : ""}`}>
      <div className="metric-card__header"><span>{metric.label}</span><AppIcon name={metricIcons[metric.kind]} size={18} aria-hidden /></div>
      <strong>{metric.value}</strong>
      <small>{metric.caption}</small>
    </Card>
  );
}
