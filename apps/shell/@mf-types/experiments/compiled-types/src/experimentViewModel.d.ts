import type { ExperimentStatus } from "@mlops/contracts";
export declare const experimentStatusView: Record<ExperimentStatus, {
    label: string;
    tone: "warning" | "success" | "danger" | "neutral" | "info";
}>;
export declare const formatDuration: (seconds: number | null) => string;
export declare const formatListDate: (iso: string) => string;
export declare const formatDetailDate: (iso: string | null) => string;
export declare const formatBytes: (bytes: number) => string;
export declare const projectOptions: {
    id: string;
    name: string;
}[];
export declare const modelOptions: {
    id: string;
    name: string;
}[];
export declare const datasetOptions: {
    id: string;
    name: string;
}[];
