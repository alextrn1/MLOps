import type { ModelVersionStage } from "@mlops/contracts";
import { StatusBadge } from "@mlops/ui";
import { getStage } from "../modelViewModel";

export function ModelStageBadge({ stage }: { stage: ModelVersionStage }) { const config = getStage(stage); return <StatusBadge tone={config.tone}>{config.label}</StatusBadge>; }
