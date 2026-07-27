import type { ModelFramework, ModelTaskType, ModelVersionStage } from "@mlops/contracts";
export declare const taskOptions: ReadonlyArray<{
    value: ModelTaskType;
    label: string;
}>;
export declare const frameworkOptions: ReadonlyArray<{
    value: ModelFramework;
    label: string;
}>;
export declare const stageOptions: ReadonlyArray<{
    value: ModelVersionStage;
    label: string;
    tone: "warning" | "success" | "neutral";
}>;
export declare const getStage: (stage: ModelVersionStage) => {
    value: ModelVersionStage;
    label: string;
    tone: "warning" | "success" | "neutral";
};
export declare const formatDate: (date: string) => string;
export declare const formatBytes: (bytes: number) => string;
