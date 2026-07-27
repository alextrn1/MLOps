import type { ExperimentDto } from "@mlops/contracts";
export type ExperimentSortKey = "name" | "status" | "startedAt" | "duration";
export declare function ExperimentsTable({ experiments, sortKey, sortAsc, onSort }: {
    experiments: ExperimentDto[];
    sortKey: ExperimentSortKey;
    sortAsc: boolean;
    onSort: (key: ExperimentSortKey) => void;
}): import("react").JSX.Element;
