import type { ProjectDeploymentSummaryDto, ProjectModelSummaryDto } from "@mlops/contracts";
export declare function ProjectRelations({ projectId, models, deployments }: {
    projectId: string;
    models: ProjectModelSummaryDto[];
    deployments: ProjectDeploymentSummaryDto[];
}): import("react").JSX.Element;
