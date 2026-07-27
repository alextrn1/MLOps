import type { ProjectStatus } from "@mlops/contracts";
export declare const projectStatusOptions: ReadonlyArray<{
    value: ProjectStatus;
    label: string;
    detailLabel: string;
    tone: "success" | "info" | "warning";
}>;
export declare const formatProjectDate: (date: string) => string;
export declare const getProjectStatus: (status: ProjectStatus) => {
    value: ProjectStatus;
    label: string;
    detailLabel: string;
    tone: "success" | "info" | "warning";
};
export declare const summaryCards: readonly [{
    readonly key: "models";
    readonly label: "Модели";
    readonly icon: "box";
    readonly iconTone: "violet";
    readonly href: "/models";
}, {
    readonly key: "datasets";
    readonly label: "Датасеты";
    readonly icon: "database";
    readonly iconTone: "cyan";
    readonly href: "/datasets";
}, {
    readonly key: "experiments";
    readonly label: "Эксперименты";
    readonly icon: "activity";
    readonly iconTone: "slate";
    readonly href: "/experiments";
}, {
    readonly key: "deployments";
    readonly label: "Развёртывания";
    readonly icon: "server";
    readonly iconTone: "green";
    readonly href: "/deployments";
}];
