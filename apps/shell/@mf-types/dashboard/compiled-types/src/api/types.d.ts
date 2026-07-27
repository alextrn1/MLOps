export type MetricKind = "active-projects" | "models" | "deployments" | "critical-alerts";
export type IncidentSeverity = "critical" | "warning";
export type DeploymentEnvironment = "production" | "staging";
export interface DashboardMetricDto {
    id: string;
    kind: MetricKind;
    label: string;
    value: number;
    caption: string;
}
export interface DashboardSummaryDto {
    metrics: DashboardMetricDto[];
}
export interface DashboardIncidentDto {
    id: string;
    title: string;
    description: string;
    detectedAt: string;
    severity: IncidentSeverity;
}
export interface DashboardIncidentsDto {
    items: DashboardIncidentDto[];
}
export interface DashboardDeploymentDto {
    id: string;
    endpoint: string;
    deployedAt: string;
    author: string;
    environment: DeploymentEnvironment;
}
export interface DashboardActivityDto {
    deployments: DashboardDeploymentDto[];
}
export interface DashboardApi {
    getSummary(): Promise<DashboardSummaryDto>;
    getActivity(): Promise<DashboardActivityDto>;
    getIncidents(): Promise<DashboardIncidentsDto>;
}
