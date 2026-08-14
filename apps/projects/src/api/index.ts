import { createApiClient } from "@mlops/api-client";
import type { CreateProjectDto, ProjectDto, ProjectMemberDto, ProjectSummaryDto, UpdateProjectDto, UpdateProjectMembersDto } from "@mlops/contracts";
import { MockProjectNotFoundError, mockProjectsApi } from "./mock";

export interface ProjectsApi {
  listProjects(): Promise<ProjectDto[]>;
  createProject(input: CreateProjectDto): Promise<ProjectDto>;
  getProject(projectId: string): Promise<ProjectDto>;
  updateProject(projectId: string, input: UpdateProjectDto): Promise<ProjectDto>;
  getProjectSummary(projectId: string): Promise<ProjectSummaryDto>;
  getProjectMembers(projectId: string): Promise<ProjectMemberDto[]>;
  updateProjectMembers(projectId: string, input: UpdateProjectMembersDto): Promise<ProjectMemberDto[]>;
}

const apiMode = import.meta.env.VITE_API_MODE ?? "mock";
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010";
const http = createApiClient({ baseUrl });

const realProjectsApi: ProjectsApi = {
  listProjects: () => http.get("/api/v1/projects"),
  createProject: (input) => http.post("/api/v1/projects", input),
  getProject: (projectId) => http.get(`/api/v1/projects/${projectId}`),
  updateProject: (projectId, input) => http.patch(`/api/v1/projects/${projectId}`, input),
  getProjectSummary: (projectId) => http.get(`/api/v1/projects/${projectId}/summary`),
  getProjectMembers: (projectId) => http.get(`/api/v1/projects/${projectId}/members`),
  updateProjectMembers: (projectId, input) => http.put(`/api/v1/projects/${projectId}/members`, input)
};

if (apiMode !== "mock" && apiMode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${apiMode}`);

export const projectsApi: ProjectsApi = apiMode === "real" ? realProjectsApi : mockProjectsApi;
export const isProjectNotFoundError = (error: unknown) => error instanceof MockProjectNotFoundError || (error instanceof Error && /404|not found/i.test(error.message));
