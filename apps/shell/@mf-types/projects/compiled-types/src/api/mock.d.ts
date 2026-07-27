import type { CreateProjectDto, ProjectDeploymentSummaryDto, ProjectDto, ProjectMemberDto, ProjectModelSummaryDto, UpdateProjectDto, UpdateProjectMembersDto } from "@mlops/contracts";
export declare class MockProjectNotFoundError extends Error {
    readonly status = 404;
}
export declare const mockProjectsApi: {
    listProjects(): Promise<ProjectDto[]>;
    createProject(input: CreateProjectDto): Promise<ProjectDto>;
    getProject(projectId: string): Promise<ProjectDto>;
    updateProject(projectId: string, input: UpdateProjectDto): Promise<ProjectDto>;
    getProjectSummary(projectId: string): Promise<{
        projectId: string;
        counts: {
            models: number;
            datasets: number;
            experiments: number;
            deployments: number;
        };
        models: ProjectModelSummaryDto[];
        deployments: ProjectDeploymentSummaryDto[];
    }>;
    getProjectMembers(projectId: string): Promise<ProjectMemberDto[]>;
    updateProjectMembers(projectId: string, input: UpdateProjectMembersDto): Promise<ProjectMemberDto[]>;
};
