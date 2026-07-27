import type { ProjectStatus } from "@mlops/contracts";
import { StatusBadge } from "@mlops/ui";
import { getProjectStatus } from "../projectViewModel";

export function ProjectStatusBadge({ status, detail = false }: { status: ProjectStatus; detail?: boolean }) {
  const config = getProjectStatus(status);
  return <StatusBadge tone={config.tone}>{detail ? config.detailLabel : config.label}</StatusBadge>;
}
