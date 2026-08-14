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

export type GlobalSearchEntityType = "project" | "model" | "dataset" | "deployment" | "incident";

export interface GlobalSearchResultDto {
  type: GlobalSearchEntityType;
  id: string;
  title: string;
  route: string;
}

export interface CurrentUserDto {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface UserSettingsDto {
  theme: "system" | "light" | "dark";
  locale: "ru-RU" | "en-US";
}

export type UpdateUserSettingsDto = Partial<UserSettingsDto>;

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

export interface DatasetProjectDto {
  id: string;
  name: string;
}

export type DatasetSourceType = "dwh" | "clickhouse" | "s3";

export interface DatasetDto {
  id: string;
  name: string;
  description: string;
  project: DatasetProjectDto;
  sourceType: DatasetSourceType;
  sourceLabel: string;
  sizeMb: number;
  rowsCount: number;
  rowsLabel: string;
  latestVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDatasetDto {
  name: string;
  description: string;
  projectId: string;
  sourceType: DatasetSourceType;
  sourceLabel: string;
}

export type UpdateDatasetDto = Partial<CreateDatasetDto>;

export interface DatasetVersionDto {
  id: string;
  datasetId: string;
  version: string;
  description: string;
  sizeMb: number;
  rowsCount: number;
  rowsLabel: string;
  author: string;
  createdAt: string;
}

export interface CreateDatasetVersionDto {
  version: string;
  description: string;
}

export interface DatasetSchemaFieldDto {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
}

export interface DatasetProfileDto {
  datasetId: string;
  versionId: string;
  rowsCount: number;
  columnsCount: number;
  sizeMb: number;
  missingValuesPercent: number;
  duplicateRowsPercent: number;
  profiledAt: string;
}

export interface DatasetLineageNodeDto {
  id: string;
  name: string;
  kind: "source" | "dataset" | "model" | "experiment";
  href: string | null;
}

export interface DatasetLineageDto {
  datasetId: string;
  upstream: DatasetLineageNodeDto[];
  downstream: DatasetLineageNodeDto[];
}

export type DeploymentEnvironment = "production" | "staging";
export type DeploymentStatus = "active" | "restarting" | "inactive" | "failed";

export interface DeploymentEntityRefDto {
  id: string;
  name: string;
}

export interface DeploymentDto {
  id: string;
  name: string;
  status: DeploymentStatus;
  environment: DeploymentEnvironment;
  url: string;
  project: DeploymentEntityRefDto;
  model: DeploymentEntityRefDto;
  modelVersionId: string;
  modelVersion: string;
  trafficPercent: number;
  deployedAt: string;
  deployedBy: string;
}

export interface CreateDeploymentDto {
  name: string;
  environment: DeploymentEnvironment;
  url: string;
  projectId: string;
  modelId: string;
  modelVersionId: string;
  trafficPercent: number;
}

export type UpdateDeploymentDto = Partial<Pick<CreateDeploymentDto, "name" | "url" | "environment">>;

export interface UpdateDeploymentTrafficDto {
  trafficPercent: number;
}

export interface DeploymentMetricPointDto {
  timestamp: string;
  timeLabel: string;
  latencyP95Ms: number;
  requestsPerHour: number;
  errorRatePercent: number;
}

export interface DeploymentMetricsDto {
  deploymentId: string;
  averageLatencyP95Ms: number;
  trafficPercent: number;
  errorRatePercent: number;
  points: DeploymentMetricPointDto[];
}

export type DeploymentEventType = "data_drift" | "model_degradation" | "error_rate" | "latency_spike" | "usage_anomaly" | "restart" | "rollback";

export interface DeploymentEventDto {
  id: string;
  deploymentId: string;
  title: string;
  type: DeploymentEventType;
  severity: "critical" | "warning" | "info";
  occurredAt: string;
  monitoringEventId: string | null;
}

export * from "./demoCatalogue";

export type IncidentStatus = "open" | "acknowledged" | "resolved";
export type IncidentSeverity = "critical" | "warning";
export type IncidentType = "latency_spike" | "data_drift" | "model_degradation" | "usage_anomaly" | "error_rate";

export interface IncidentEntityRefDto { id: string; name: string; }
export interface IncidentDeploymentRefDto extends IncidentEntityRefDto { url: string; environment: "production" | "staging"; }
export interface IncidentMetricDto { label: string; value: number; formattedValue: string; threshold: number; formattedThreshold: string; tone: "danger" | "warning"; }
export interface IncidentExternalIntegrationsDto { grafanaUrl: string | null; logsUrl: string | null; }

export interface IncidentDto {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  typeLabel: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  deployment: IncidentDeploymentRefDto;
  project: IncidentEntityRefDto;
  metric: IncidentMetricDto;
  integrations: IncidentExternalIntegrationsDto;
  detectedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

export type IncidentTimelineEventType = "created" | "acknowledged" | "comment" | "resolved" | "reopened";
export interface IncidentTimelineEventDto { id: string; incidentId: string; type: IncidentTimelineEventType; author: string; message: string; createdAt: string; }
export interface CreateIncidentCommentDto { message: string; }

export interface AlertRuleDto {
  id: string;
  name: string;
  incidentType: IncidentType;
  metric: string;
  operator: "gt" | "gte" | "lt" | "lte";
  threshold: number;
  enabled: boolean;
  deploymentId: string | null;
}

export interface CreateAlertRuleDto {
  name: string;
  incidentType: IncidentType;
  metric: string;
  operator: AlertRuleDto["operator"];
  threshold: number;
  enabled: boolean;
  deploymentId: string | null;
}

export type UpdateAlertRuleDto = Partial<CreateAlertRuleDto>;
