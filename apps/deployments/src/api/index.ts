import { createApiClient } from "@mlops/api-client";
import type {
  CreateDeploymentDto,
  DeploymentDto,
  DeploymentEventDto,
  DeploymentMetricsDto,
  UpdateDeploymentDto,
  UpdateDeploymentTrafficDto
} from "@mlops/contracts";
import { MockDeploymentApiError, mockDeploymentsApi } from "./mock";

export interface DeploymentsApi {
  listDeployments(): Promise<DeploymentDto[]>;
  createDeployment(input: CreateDeploymentDto): Promise<DeploymentDto>;
  getDeployment(deploymentId: string): Promise<DeploymentDto>;
  updateDeployment(deploymentId: string, input: UpdateDeploymentDto): Promise<DeploymentDto>;
  restartDeployment(deploymentId: string): Promise<DeploymentDto>;
  rollbackDeployment(deploymentId: string): Promise<DeploymentDto>;
  updateTraffic(deploymentId: string, input: UpdateDeploymentTrafficDto): Promise<DeploymentDto>;
  getMetrics(deploymentId: string): Promise<DeploymentMetricsDto>;
  getEvents(deploymentId: string): Promise<DeploymentEventDto[]>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010" });

const realDeploymentsApi: DeploymentsApi = {
  listDeployments: () => http.get("/api/v1/deployments"),
  createDeployment: (input) => http.post("/api/v1/deployments", input),
  getDeployment: (id) => http.get(`/api/v1/deployments/${id}`),
  updateDeployment: (id, input) => http.patch(`/api/v1/deployments/${id}`, input),
  restartDeployment: (id) => http.post(`/api/v1/deployments/${id}/restart`, {}),
  rollbackDeployment: (id) => http.post(`/api/v1/deployments/${id}/rollback`, {}),
  updateTraffic: (id, input) => http.patch(`/api/v1/deployments/${id}/traffic`, input),
  getMetrics: (id) => http.get(`/api/v1/deployments/${id}/metrics`),
  getEvents: (id) => http.get(`/api/v1/deployments/${id}/events`)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const deploymentsApi: DeploymentsApi = mode === "real" ? realDeploymentsApi : mockDeploymentsApi;
export const isDeploymentNotFound = (error: unknown) => error instanceof MockDeploymentApiError || error instanceof Error && /404|deployment not found/i.test(error.message);
