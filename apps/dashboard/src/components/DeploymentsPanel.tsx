import { Card, EmptyState, StatusBadge } from "@mlops/ui";
import { Link } from "react-router-dom";
import type { DashboardDeploymentDto } from "../api";

export function DeploymentsPanel({ deployments }: { deployments: DashboardDeploymentDto[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="dashboard-panel__header"><h2>Последние развёртывания</h2></div>
      <div className="dashboard-panel__body">
        {deployments.length === 0 ? <EmptyState title="Развёртываний пока нет" description="Новые endpoints появятся здесь после публикации." /> : deployments.map((deployment) => (
          <article className="deployment-row" key={deployment.id}>
            <div className="deployment-row__content"><span className="deployment-row__dot" aria-hidden /><div><Link to={`/deployments/${deployment.id}`}>Endpoint: {deployment.endpoint}</Link><p>{deployment.deployedAt} • {deployment.author}</p></div></div>
            <StatusBadge tone={deployment.environment === "staging" ? "info" : "primary"}>{deployment.environment === "staging" ? "STG" : "PROD"}</StatusBadge>
          </article>
        ))}
      </div>
    </Card>
  );
}
