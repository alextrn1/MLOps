import type { ExperimentArtifactDto, ExperimentDto, ExperimentLogLineDto, ExperimentMetricDto, ExperimentParameterDto } from "@mlops/contracts";
export declare function MetricsPanel({ metrics }: {
    metrics: ExperimentMetricDto[];
}): import("react").JSX.Element;
export declare function RuntimePanel({ experiment }: {
    experiment: ExperimentDto;
}): import("react").JSX.Element;
export declare function ParametersPanel({ parameters }: {
    parameters: ExperimentParameterDto[];
}): import("react").JSX.Element;
export declare function ResourcesPanel({ experiment }: {
    experiment: ExperimentDto;
}): import("react").JSX.Element;
export declare function SupportingDataPanel({ artifacts, logs }: {
    artifacts: ExperimentArtifactDto[];
    logs: ExperimentLogLineDto[];
}): import("react").JSX.Element;
