import type { CreateProjectDto, ProjectDto, ProjectMemberDto, ProjectSummaryDto, UpdateProjectDto, UpdateProjectMembersDto } from "@mlops/contracts";
export interface ProjectsApi {
    listProjects(): Promise<ProjectDto[]>;
    createProject(input: CreateProjectDto): Promise<ProjectDto>;
    getProject(projectId: string): Promise<ProjectDto>;
    updateProject(projectId: string, input: UpdateProjectDto): Promise<ProjectDto>;
    getProjectSummary(projectId: string): Promise<ProjectSummaryDto>;
    getProjectMembers(projectId: string): Promise<ProjectMemberDto[]>;
    updateProjectMembers(projectId: string, input: UpdateProjectMembersDto): Promise<ProjectMemberDto[]>;
}
export declare const projectsApi: ProjectsApi;
export declare const isProjectNotFoundError: (error: unknown) => boolean;
