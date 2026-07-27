export type SectionId =
  | "dashboard"
  | "projects"
  | "models"
  | "experiments"
  | "datasets"
  | "deployments"
  | "monitoring";

export interface SectionSummaryDto {
  id: SectionId;
  title: string;
}

export interface ApiErrorDto {
  code: string;
  message: string;
}

export type ProjectStatus = "active" | "completed" | "paused";
export type ProjectMemberRole = "owner" | "lead" | "member";

export interface ProjectOwnerDto {
  id: string;
  name: string;
  title: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  owner: ProjectOwnerDto;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectModelSummaryDto {
  id: string;
  name: string;
  framework: string;
  task: string;
}

export interface ProjectDeploymentSummaryDto {
  id: string;
  name: string;
  environment: "production" | "staging";
  trafficPercent: number;
}

export interface ProjectSummaryDto {
  projectId: string;
  counts: {
    models: number;
    datasets: number;
    experiments: number;
    deployments: number;
  };
  models: ProjectModelSummaryDto[];
  deployments: ProjectDeploymentSummaryDto[];
}

export interface ProjectMemberDto {
  userId: string;
  name: string;
  title: string;
  role: ProjectMemberRole;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  ownerId: string;
  status: ProjectStatus;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface UpdateProjectMembersDto {
  members: Array<Pick<ProjectMemberDto, "userId" | "role">>;
}

export type ModelTaskType = "classification" | "recommendation" | "computer_vision";
export type ModelFramework = "xgboost" | "pytorch" | "scikit-learn";
export type ModelVersionStage = "staging" | "production" | "archived";

export interface ModelProjectDto {
  id: string;
  name: string;
}

export interface ModelDto {
  id: string;
  name: string;
  description: string;
  project: ModelProjectDto;
  taskType: ModelTaskType;
  framework: ModelFramework;
  versionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModelDto {
  name: string;
  description: string;
  projectId: string;
  taskType: ModelTaskType;
  framework: ModelFramework;
}

export type UpdateModelDto = Partial<CreateModelDto>;

export interface ModelVersionDto {
  id: string;
  modelId: string;
  version: string;
  stage: ModelVersionStage;
  latencyP95Ms: number | null;
  author: string;
  createdAt: string;
  description: string;
}

export interface CreateModelVersionDto {
  version: string;
  stage: ModelVersionStage;
  description: string;
  latencyP95Ms?: number | null;
}

export interface UpdateModelVersionStageDto {
  stage: ModelVersionStage;
}

export interface ModelMetricDto {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
}

export interface ModelArtifactDto {
  id: string;
  name: string;
  type: "model" | "metadata" | "environment";
  sizeBytes: number;
  uri: string;
}

export type ExperimentStatus = "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

export interface ExperimentEntityRefDto {
  id: string;
  name: string;
}

export interface ExperimentDatasetRefDto extends ExperimentEntityRefDto {
  version: string;
}

export interface ExperimentMetricDto {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
}

export interface ExperimentParameterDto {
  key: string;
  value: string | number | boolean;
}

export interface ExperimentArtifactDto {
  id: string;
  name: string;
  kind: "model" | "report" | "metadata";
  sizeBytes: number;
  uri: string;
}

export interface ExperimentLogLineDto {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface ExperimentDto {
  id: string;
  name: string;
  status: ExperimentStatus;
  project: ExperimentEntityRefDto;
  model: ExperimentEntityRefDto | null;
  modelVersionId: string | null;
  dataset: ExperimentDatasetRefDto;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  keyMetric: ExperimentMetricDto | null;
}

export interface CreateExperimentDto {
  name: string;
  projectId: string;
  modelId: string;
  datasetId: string;
}
