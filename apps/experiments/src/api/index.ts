import { createApiClient } from "@mlops/api-client";
import type { CreateExperimentDto, ExperimentArtifactDto, ExperimentDto, ExperimentLogLineDto, ExperimentMetricDto, ExperimentParameterDto } from "@mlops/contracts";
import { MockExperimentApiError, mockExperimentsApi } from "./mock";

export interface ExperimentsApi {
  listFormProjects(): Promise<ReadonlyArray<{ id: string; name: string }>>;
  listFormModels(): Promise<ReadonlyArray<{ id: string; name: string; projectId: string }>>;
  listFormDatasets(): Promise<ReadonlyArray<{ id: string; name: string; projectId: string; latestVersion: string }>>;
  listExperiments(): Promise<ExperimentDto[]>;
  createExperiment(input: CreateExperimentDto): Promise<ExperimentDto>;
  getExperiment(experimentId: string): Promise<ExperimentDto>;
  cancelExperiment(experimentId: string): Promise<ExperimentDto>;
  retryExperiment(experimentId: string): Promise<ExperimentDto>;
  getMetrics(experimentId: string): Promise<ExperimentMetricDto[]>;
  getParameters(experimentId: string): Promise<ExperimentParameterDto[]>;
  getArtifacts(experimentId: string): Promise<ExperimentArtifactDto[]>;
  getLogs(experimentId: string): Promise<ExperimentLogLineDto[]>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010" });
const realExperimentsApi: ExperimentsApi = {
  listFormProjects: () => http.get<Array<{ id: string; name: string }>>("/api/v1/projects"),
  listFormModels: async () => (await http.get<import("@mlops/contracts").ModelDto[]>("/api/v1/models")).map((model) => ({
    id: model.id,
    name: model.name,
    projectId: model.project.id
  })),
  listFormDatasets: async () => (await http.get<import("@mlops/contracts").DatasetDto[]>("/api/v1/datasets")).map((dataset) => ({
    id: dataset.id,
    name: dataset.name,
    projectId: dataset.project.id,
    latestVersion: dataset.latestVersion
  })),
  listExperiments: () => http.get("/api/v1/experiments"),
  createExperiment: (input) => http.post("/api/v1/experiments", input),
  getExperiment: (id) => http.get(`/api/v1/experiments/${id}`),
  cancelExperiment: (id) => http.post(`/api/v1/experiments/${id}/cancel`, {}),
  retryExperiment: (id) => http.post(`/api/v1/experiments/${id}/retry`, {}),
  getMetrics: (id) => http.get(`/api/v1/experiments/${id}/metrics`),
  getParameters: (id) => http.get(`/api/v1/experiments/${id}/parameters`),
  getArtifacts: (id) => http.get(`/api/v1/experiments/${id}/artifacts`),
  getLogs: (id) => http.get(`/api/v1/experiments/${id}/logs`)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const experimentsApi: ExperimentsApi = mode === "real" ? realExperimentsApi : mockExperimentsApi;
export const isExperimentNotFound = (error: unknown) => error instanceof MockExperimentApiError || error instanceof Error && /404|experiment not found/i.test(error.message);
