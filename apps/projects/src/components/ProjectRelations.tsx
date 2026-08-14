import type { ProjectDeploymentSummaryDto, ProjectModelSummaryDto } from "@mlops/contracts";
import { Card, StatusBadge } from "@mlops/ui";
import { Link } from "react-router-dom";

function ModelsPanel({ models }: { models: ProjectModelSummaryDto[] }) {
  return <Card className="relation-panel"><div className="relation-panel__header"><h2>Связанные модели</h2><Link to="/models">Все модели</Link></div><div className="relation-panel__body">{models.length ? models.map((model) => <div className="relation-row" key={model.id}><Link to={`/models/${model.id}`}>{model.name}</Link><span>{model.framework} • {model.task}</span></div>) : <p className="relation-empty">Нет привязанных моделей</p>}</div></Card>;
}

function DeploymentsPanel({ deployments }: { deployments: ProjectDeploymentSummaryDto[] }) {
  return <Card className="relation-panel"><div className="relation-panel__header"><h2>Активные развёртывания</h2><Link to="/deployments">Все</Link></div><div className="relation-panel__body">{deployments.length ? deployments.map((deployment) => <div className="relation-row relation-row--deployment" key={deployment.id}><span><Link to={`/deployments/${deployment.id}`}>{deployment.name}</Link><small>Трафик: {deployment.trafficPercent}%</small></span><StatusBadge tone={deployment.environment === "production" ? "primary" : "info"}>{deployment.environment}</StatusBadge></div>) : <p className="relation-empty">Нет активных развёртываний</p>}</div></Card>;
}

export function ProjectRelations({ models, deployments }: { models: ProjectModelSummaryDto[]; deployments: ProjectDeploymentSummaryDto[] }) {
  return <div className="project-relations"><ModelsPanel models={models} /><DeploymentsPanel deployments={deployments} /></div>;
}
