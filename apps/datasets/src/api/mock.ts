import { demoProjects, type CreateDatasetDto, type CreateDatasetVersionDto, type DatasetDto, type DatasetLineageDto, type DatasetProfileDto, type DatasetProjectDto, type DatasetSchemaFieldDto, type DatasetVersionDto, type UpdateDatasetDto } from "@mlops/contracts";
import { waitForMockDelay } from "@mlops/api-client";
import type { DatasetsApi } from ".";

export class MockDatasetApiError extends Error {}
const wait = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);

const projects = Object.fromEntries(demoProjects.map((project) => [project.id, { ...project }])) as Record<string, DatasetProjectDto>;

let datasets: DatasetDto[] = [
  { id: "d1", name: "retail_credit_history_v2", description: "Исторические данные по кредитам с обогащением из БКИ", project: projects.p1, sourceType: "dwh", sourceLabel: "DWH (Hadoop)", sizeMb: 4500, rowsCount: 15400000, rowsLabel: "15.4M", latestVersion: "2.1.0", createdAt: "2024-03-01", updatedAt: "2024-03-01" },
  { id: "d2", name: "user_interactions_q1", description: "Клики, просмотры и покупки за Q1 2024", project: projects.p2, sourceType: "clickhouse", sourceLabel: "ClickHouse Event Stream", sizeMb: 12400, rowsCount: 85000000, rowsLabel: "85.0M", latestVersion: "1.0.0", createdAt: "2024-04-05", updatedAt: "2024-04-05" },
  { id: "d3", name: "passport_scans_augmented", description: "Аугментированный датасет сканов с разметкой bounding boxes", project: projects.p3, sourceType: "s3", sourceLabel: "S3 / LabelStudio", sizeMb: 45000, rowsCount: 150000, rowsLabel: "150 000", latestVersion: "4.0.2", createdAt: "2023-09-10", updatedAt: "2023-09-10" },
  { id: "d4", name: "retail_credit_history_v1", description: "Старая версия без данных БКИ", project: projects.p1, sourceType: "dwh", sourceLabel: "DWH (Hadoop)", sizeMb: 3200, rowsCount: 12000000, rowsLabel: "12.0M", latestVersion: "1.0.0", createdAt: "2023-11-15", updatedAt: "2023-11-15" }
];

let versions: DatasetVersionDto[] = [
  { id: "v21", datasetId: "d1", version: "2.1.0", description: "Добавлены признаки бюро кредитных историй", sizeMb: 4500, rowsCount: 15400000, rowsLabel: "15.4M", author: "Анна Смирнова", createdAt: "2024-03-01" },
  { id: "v20", datasetId: "d1", version: "2.0.0", description: "Очистка и нормализация кредитной истории", sizeMb: 4180, rowsCount: 15100000, rowsLabel: "15.1M", author: "Анна Смирнова", createdAt: "2024-02-12" },
  { id: "v10", datasetId: "d2", version: "1.0.0", description: "Первый срез взаимодействий за квартал", sizeMb: 12400, rowsCount: 85000000, rowsLabel: "85.0M", author: "Иван Петров", createdAt: "2024-04-05" },
  { id: "v402", datasetId: "d3", version: "4.0.2", description: "Расширена аугментация и исправлена разметка", sizeMb: 45000, rowsCount: 150000, rowsLabel: "150 000", author: "Сергей Иванов", createdAt: "2023-09-10" },
  { id: "v100", datasetId: "d4", version: "1.0.0", description: "Исходный набор кредитной истории", sizeMb: 3200, rowsCount: 12000000, rowsLabel: "12.0M", author: "Анна Смирнова", createdAt: "2023-11-15" }
];

const schema: DatasetSchemaFieldDto[] = [
  { name: "customer_id", type: "string", nullable: false, description: "Идентификатор клиента" },
  { name: "credit_score", type: "integer", nullable: false, description: "Скоринговый балл" },
  { name: "income_verified", type: "boolean", nullable: true, description: "Подтверждение дохода" },
  { name: "default_target", type: "integer", nullable: false, description: "Целевая переменная" }
];

function findDataset(id: string) { const value = datasets.find((item) => item.id === id); if (!value) throw new MockDatasetApiError("404 dataset not found"); return value; }
function findVersion(id: string, versionId: string) { findDataset(id); const value = versions.find((item) => item.datasetId === id && item.id === versionId); if (!value) throw new MockDatasetApiError("404 version not found"); return value; }

export const mockDatasetsApi: DatasetsApi = {
  async listFormProjects() { return clone(demoProjects); },
  async listDatasets() { await wait(); return clone(datasets); },
  async createDataset(input: CreateDatasetDto) { await wait(); const now = new Date().toISOString().slice(0, 10); const created: DatasetDto = { id: `d${Date.now()}`, ...input, project: projects[input.projectId] ?? projects.p1, sizeMb: 0, rowsCount: 0, rowsLabel: "0", latestVersion: "—", createdAt: now, updatedAt: now }; datasets = [created, ...datasets]; return clone(created); },
  async getDataset(id) { await wait(); return clone(findDataset(id)); },
  async updateDataset(id, input: UpdateDatasetDto) { await wait(); const current = findDataset(id); const updated = { ...current, ...input, project: input.projectId ? projects[input.projectId] ?? current.project : current.project, updatedAt: new Date().toISOString().slice(0, 10) }; datasets = datasets.map((item) => item.id === id ? updated : item); return clone(updated); },
  async listVersions(id) { await wait(); findDataset(id); return clone(versions.filter((item) => item.datasetId === id)); },
  async createVersion(id, input: CreateDatasetVersionDto) { await wait(); const dataset = findDataset(id); const created: DatasetVersionDto = { id: `v${Date.now()}`, datasetId: id, ...input, sizeMb: dataset.sizeMb, rowsCount: dataset.rowsCount, rowsLabel: dataset.rowsLabel, author: "Анна Смирнова", createdAt: new Date().toISOString().slice(0, 10) }; versions = [created, ...versions]; datasets = datasets.map((item) => item.id === id ? { ...item, latestVersion: input.version } : item); return clone(created); },
  async getVersion(id, versionId) { await wait(); return clone(findVersion(id, versionId)); },
  async getSchema(id, versionId) { await wait(); findVersion(id, versionId); return clone(schema); },
  async getProfile(id, versionId) { await wait(); const version = findVersion(id, versionId); return { datasetId: id, versionId, rowsCount: version.rowsCount, columnsCount: schema.length, sizeMb: version.sizeMb, missingValuesPercent: 0.8, duplicateRowsPercent: 0.2, profiledAt: version.createdAt }; },
  async getLineage(id): Promise<DatasetLineageDto> { await wait(); const dataset = findDataset(id); return { datasetId: id, upstream: [{ id: `src-${id}`, name: dataset.sourceLabel, kind: "source", href: null }], downstream: [{ id: "e1", name: "xgb_bki_features_tuning", kind: "experiment", href: "/experiments/e1" }, { id: "m1", name: "RetailScoring_XGB", kind: "model", href: "/models/m1" }] }; }
};
