import type { ExperimentStatus } from "@mlops/contracts";
import { StatusBadge } from "@mlops/ui";
import { experimentStatusView } from "../experimentViewModel";

export function ExperimentStatusBadge({ status }: { status: ExperimentStatus }) {
  const view = experimentStatusView[status];
  return <StatusBadge tone={view.tone}>{view.label}</StatusBadge>;
}
