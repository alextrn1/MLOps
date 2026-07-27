import type { ProjectSummaryDto } from "@mlops/contracts";
import { AppIcon, Card, type AppIconName } from "@mlops/ui";
import { Link } from "react-router-dom";
import { summaryCards } from "../projectViewModel";

export function ProjectSummaryCards({ projectId, summary }: { projectId: string; summary: ProjectSummaryDto }) {
  return <div className="project-summary-grid">{summaryCards.map((item) => (
    <Link key={item.key} to={`${item.href}?projectId=${encodeURIComponent(projectId)}`} className="summary-link">
      <Card className="project-summary-card">
        <span className={`summary-icon summary-icon--${item.iconTone}`}><AppIcon name={item.icon as AppIconName} size={26} strokeWidth={1.9} aria-hidden /></span>
        <span><small>{item.label}</small><strong>{summary.counts[item.key]}</strong></span>
      </Card>
    </Link>
  ))}</div>;
}
