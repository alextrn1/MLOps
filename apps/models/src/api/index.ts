import { createApiClient } from "@mlops/api-client";
import type { CreateModelDto, CreateModelVersionDto, ModelArtifactDto, ModelDto, ModelMetricDto, ModelVersionDto, UpdateModelDto, UpdateModelVersionStageDto } from "@mlops/contracts";
import { MockModelApiError, mockModelsApi } from "./mock";

export interface ModelsApi {
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
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000" });
const realModelsApi: ModelsApi = {
  listModels: () => http.get("/api/v1/models"),
  createModel: (input) => http.post("/api/v1/models", input),
  getModel: (modelId) => http.get(`/api/v1/models/${modelId}`),
  updateModel: (modelId, input) => http.patch(`/api/v1/models/${modelId}`, input),
  listVersions: (modelId) => http.get(`/api/v1/models/${modelId}/versions`),
  createVersion: (modelId, input) => http.post(`/api/v1/models/${modelId}/versions`, input),
  getVersion: (modelId, versionId) => http.get(`/api/v1/models/${modelId}/versions/${versionId}`),
  updateVersionStage: (modelId, versionId, input) => http.patch(`/api/v1/models/${modelId}/versions/${versionId}/stage`, input),
  getVersionMetrics: (modelId, versionId) => http.get(`/api/v1/models/${modelId}/versions/${versionId}/metrics`),
  getVersionArtifacts: (modelId, versionId) => http.get(`/api/v1/models/${modelId}/versions/${versionId}/artifacts`)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const modelsApi: ModelsApi = mode === "real" ? realModelsApi : mockModelsApi;
export const isModelNotFound = (error: unknown) => error instanceof MockModelApiError ? error.resource === "model" : error instanceof Error && /404|model not found/i.test(error.message);
export const isVersionNotFound = (error: unknown) => error instanceof MockModelApiError ? error.resource === "version" : error instanceof Error && /404|version not found/i.test(error.message);
