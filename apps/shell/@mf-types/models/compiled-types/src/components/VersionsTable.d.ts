import type { ModelMetricDto, ModelVersionDto } from "@mlops/contracts";
export declare function VersionsTable({ modelId, versions, metrics }: {
    modelId: string;
    versions: ModelVersionDto[];
    metrics: Record<string, ModelMetricDto[]>;
}): import("react").JSX.Element;
