import type {
  CreateProjectDto,
  ProjectDeploymentSummaryDto,
  ProjectDto,
  ProjectMemberDto,
  ProjectModelSummaryDto,
  ProjectOwnerDto,
  ProjectSummaryDto,
  UpdateProjectDto,
  UpdateProjectMembersDto
} from "@mlops/contracts";
import { waitForMockDelay } from "@mlops/api-client";
import { demoUsers } from "@mlops/contracts";

const owners: ProjectOwnerDto[] = demoUsers.map((owner) => ({ ...owner }));

let projects: ProjectDto[] = [
  { id: "p1", name: "Кредитный Скоринг Retail", description: "Оценка вероятности дефолта физических лиц по потребительским кредитам", owner: owners[0], status: "active", createdAt: "2023-11-10", updatedAt: "2024-04-11" },
  { id: "p2", name: "Рекомендации товаров e-commerce", description: "Система персональных рекомендаций на главной странице и в карточке товара", owner: owners[1], status: "active", createdAt: "2024-01-15", updatedAt: "2024-04-02" },
  { id: "p3", name: "Распознавание документов", description: "OCR и извлечение сущностей из сканов паспортов и СНИЛС", owner: owners[2], status: "completed", createdAt: "2023-08-05", updatedAt: "2024-02-12" },
  { id: "p4", name: "Прогнозирование оттока B2B", description: "Предиктивная модель вероятности ухода корпоративных клиентов", owner: owners[3], status: "paused", createdAt: "2024-02-20", updatedAt: "2024-03-18" }
];

const models: Record<string, ProjectModelSummaryDto[]> = {
  p1: [
    { id: "m1", name: "RetailScoring_XGB", framework: "xgboost", task: "classification" },
    { id: "m4", name: "RetailScoring_LogReg", framework: "scikit-learn", task: "classification" }
  ],
  p2: [{ id: "m2", name: "TwoTower_RecSys", framework: "pytorch", task: "recommendation" }],
  p3: [{ id: "m3", name: "DocYOLO_Entities", framework: "pytorch", task: "computer_vision" }],
  p4: []
};

const deployments: Record<string, ProjectDeploymentSummaryDto[]> = {
  p1: [
    { id: "dep1", name: "scoring", environment: "production", trafficPercent: 100 },
    { id: "dep2", name: "scoring", environment: "staging", trafficPercent: 100 }
  ],
  p2: [{ id: "dep3", name: "recsys", environment: "production", trafficPercent: 100 }],
  p3: [{ id: "dep4", name: "ocr", environment: "production", trafficPercent: 100 }],
  p4: []
};

const otherCounts: Record<string, Pick<ProjectSummaryDto["counts"], "datasets" | "experiments">> = {
  p1: { datasets: 2, experiments: 2 },
  p2: { datasets: 1, experiments: 1 },
  p3: { datasets: 1, experiments: 0 },
  p4: { datasets: 0, experiments: 1 }
};

let members: Record<string, ProjectMemberDto[]> = Object.fromEntries(
  projects.map((project) => [project.id, [{ userId: project.owner.id, name: project.owner.name, title: project.owner.title, role: "owner" }]])
);

const wait = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);

export class MockProjectNotFoundError extends Error {
  readonly status = 404;
}

function findProject(projectId: string) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) throw new MockProjectNotFoundError("Project not found");
  return project;
}

export const mockProjectsApi = {
  async listProjects() { await wait(); return clone(projects); },
  async createProject(input: CreateProjectDto) {
    await wait();
    const owner = owners.find((item) => item.id === input.ownerId) ?? owners[0];
    const now = new Date().toISOString().slice(0, 10);
    const project: ProjectDto = { id: `p${projects.length + 1}`, name: input.name.trim(), description: input.description.trim(), owner, status: input.status, createdAt: now, updatedAt: now };
    projects = [...projects, project]; models[project.id] = []; deployments[project.id] = []; otherCounts[project.id] = { datasets: 0, experiments: 0 };
    members[project.id] = [{ userId: owner.id, name: owner.name, title: owner.title, role: "owner" }];
    return clone(project);
  },
  async getProject(projectId: string) { await wait(); return clone(findProject(projectId)); },
  async updateProject(projectId: string, input: UpdateProjectDto) {
    await wait();
    const current = findProject(projectId);
    const owner = input.ownerId ? owners.find((item) => item.id === input.ownerId) ?? current.owner : current.owner;
    const updated: ProjectDto = { ...current, ...(input.name !== undefined ? { name: input.name.trim() } : {}), ...(input.description !== undefined ? { description: input.description.trim() } : {}), ...(input.status ? { status: input.status } : {}), owner, updatedAt: new Date().toISOString().slice(0, 10) };
    projects = projects.map((item) => item.id === projectId ? updated : item);
    return clone(updated);
  },
  async getProjectSummary(projectId: string) {
    await wait(); findProject(projectId);
    const projectModels = models[projectId] ?? []; const projectDeployments = deployments[projectId] ?? [];
    return clone({ projectId, counts: { models: projectModels.length, datasets: otherCounts[projectId]?.datasets ?? 0, experiments: otherCounts[projectId]?.experiments ?? 0, deployments: projectDeployments.length }, models: projectModels, deployments: projectDeployments } satisfies ProjectSummaryDto);
  },
  async getProjectMembers(projectId: string) { await wait(); findProject(projectId); return clone(members[projectId] ?? []); },
  async updateProjectMembers(projectId: string, input: UpdateProjectMembersDto) {
    await wait(); findProject(projectId);
    members[projectId] = input.members.map((member) => { const user = owners.find((item) => item.id === member.userId) ?? owners[0]; return { userId: user.id, name: user.name, title: user.title, role: member.role }; });
    return clone(members[projectId]);
  }
};
