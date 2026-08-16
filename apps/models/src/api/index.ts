import { ApiError, createApiClient } from "@mlops/api-client";
import type { CreateModelDto, CreateModelVersionDto, ModelArtifactDto, ModelDto, ModelMetricDto, ModelVersionDto, UpdateModelDto, UpdateModelVersionStageDto } from "@mlops/contracts";
import { MockModelApiError, mockModelsApi } from "./mock";

export interface ModelsApi {
  listFormProjects(): Promise<ReadonlyArray<{ id: string; name: string }>>;
  listModels(): Promise<ModelDto[]>;
  createModel(input: CreateModelDto): Promise<ModelDto>;
  getModel(modelId: string): Promise<ModelDto>;
  updateModel(modelId: string, input: UpdateModelDto): Promise<ModelDto>;
  listVersions(modelId: string): Promise<ModelVersionDto[]>;
  createVersion(modelId: string, input: CreateModelVersionDto): Promise<ModelVersionDto>;
  getVersion(modelId: string, versionId: string): Promise<ModelVersionDto>;
  updateVersionStage(modelId: string, versionId: string, input: UpdateModelVersionStageDto): Promise<ModelVersionDto>;
  getVersionMetrics(modelId: string, versionId: string): Promise<ModelMetricDto[]>;
  getVersionArtifacts(modelId: string, versionId: string): Promise<ModelArtifactDto[]>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010" });

class ModelApiNotFoundError extends Error {
  constructor(readonly resource: "model" | "version") {
    super(`${resource} not found`);
  }
}

async function withNotFoundResource<T>(resource: "model" | "version", request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) throw new ModelApiNotFoundError(resource);
    throw error;
  }
}

const realModelsApi: ModelsApi = {
  listFormProjects: () => http.get("/api/v1/projects"),
  listModels: () => http.get("/api/v1/models"),
  createModel: (input) => http.post("/api/v1/models", input),
  getModel: (modelId) => withNotFoundResource("model", () => http.get(`/api/v1/models/${modelId}`)),
  updateModel: (modelId, input) => withNotFoundResource("model", () => http.patch(`/api/v1/models/${modelId}`, input)),
  listVersions: (modelId) => withNotFoundResource("model", () => http.get(`/api/v1/models/${modelId}/versions`)),
  createVersion: (modelId, input) => withNotFoundResource("model", () => http.post(`/api/v1/models/${modelId}/versions`, input)),
  getVersion: (modelId, versionId) => withNotFoundResource("version", () => http.get(`/api/v1/models/${modelId}/versions/${versionId}`)),
  updateVersionStage: (modelId, versionId, input) => withNotFoundResource("version", () => http.patch(`/api/v1/models/${modelId}/versions/${versionId}/stage`, input)),
  getVersionMetrics: (modelId, versionId) => withNotFoundResource("version", () => http.get(`/api/v1/models/${modelId}/versions/${versionId}/metrics`)),
  getVersionArtifacts: (modelId, versionId) => withNotFoundResource("version", () => http.get(`/api/v1/models/${modelId}/versions/${versionId}/artifacts`))
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const modelsApi: ModelsApi = mode === "real" ? realModelsApi : mockModelsApi;
export const isModelNotFound = (error: unknown) => error instanceof MockModelApiError || error instanceof ModelApiNotFoundError ? error.resource === "model" : error instanceof Error && /model not found/i.test(error.message);
export const isVersionNotFound = (error: unknown) => error instanceof MockModelApiError || error instanceof ModelApiNotFoundError ? error.resource === "version" : error instanceof Error && /version not found/i.test(error.message);
