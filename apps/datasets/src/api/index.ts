import { createApiClient } from "@mlops/api-client";
import type { CreateDatasetDto, CreateDatasetVersionDto, DatasetDto, DatasetLineageDto, DatasetProfileDto, DatasetSchemaFieldDto, DatasetVersionDto, UpdateDatasetDto } from "@mlops/contracts";
import { MockDatasetApiError, mockDatasetsApi } from "./mock";

export interface DatasetsApi {
  listDatasets(): Promise<DatasetDto[]>;
  createDataset(input: CreateDatasetDto): Promise<DatasetDto>;
  getDataset(datasetId: string): Promise<DatasetDto>;
  updateDataset(datasetId: string, input: UpdateDatasetDto): Promise<DatasetDto>;
  listVersions(datasetId: string): Promise<DatasetVersionDto[]>;
  createVersion(datasetId: string, input: CreateDatasetVersionDto): Promise<DatasetVersionDto>;
  getVersion(datasetId: string, versionId: string): Promise<DatasetVersionDto>;
  getSchema(datasetId: string, versionId: string): Promise<DatasetSchemaFieldDto[]>;
  getProfile(datasetId: string, versionId: string): Promise<DatasetProfileDto>;
  getLineage(datasetId: string): Promise<DatasetLineageDto>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000" });
const realDatasetsApi: DatasetsApi = {
  listDatasets: () => http.get("/api/v1/datasets"),
  createDataset: (input) => http.post("/api/v1/datasets", input),
  getDataset: (id) => http.get(`/api/v1/datasets/${id}`),
  updateDataset: (id, input) => http.patch(`/api/v1/datasets/${id}`, input),
  listVersions: (id) => http.get(`/api/v1/datasets/${id}/versions`),
  createVersion: (id, input) => http.post(`/api/v1/datasets/${id}/versions`, input),
  getVersion: (id, versionId) => http.get(`/api/v1/datasets/${id}/versions/${versionId}`),
  getSchema: (id, versionId) => http.get(`/api/v1/datasets/${id}/versions/${versionId}/schema`),
  getProfile: (id, versionId) => http.get(`/api/v1/datasets/${id}/versions/${versionId}/profile`),
  getLineage: (id) => http.get(`/api/v1/datasets/${id}/lineage`)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const datasetsApi: DatasetsApi = mode === "real" ? realDatasetsApi : mockDatasetsApi;
export const isDatasetNotFound = (error: unknown) => error instanceof MockDatasetApiError || error instanceof Error && /404|dataset not found|version not found/i.test(error.message);
