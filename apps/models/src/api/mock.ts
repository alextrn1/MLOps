import type {
  CreateModelDto,
  CreateModelVersionDto,
  ModelArtifactDto,
  ModelDto,
  ModelMetricDto,
  ModelProjectDto,
  ModelVersionDto,
  UpdateModelDto,
  UpdateModelVersionStageDto
} from "@mlops/contracts";

const projects: ModelProjectDto[] = [
  { id: "p1", name: "Кредитный Скоринг Retail" },
  { id: "p2", name: "Рекомендации товаров e-commerce" },
  { id: "p3", name: "Распознавание документов" }
];

let models: ModelDto[] = [
  { id: "m1", name: "RetailScoring_XGB", description: "Градиентный бустинг для оценки вероятности дефолта", project: projects[0], taskType: "classification", framework: "xgboost", versionsCount: 3, createdAt: "2024-01-10", updatedAt: "2024-04-10" },
  { id: "m2", name: "TwoTower_RecSys", description: "Двухбашенная нейросеть для подбора кандидатов", project: projects[1], taskType: "recommendation", framework: "pytorch", versionsCount: 1, createdAt: "2024-04-01", updatedAt: "2024-04-01" },
  { id: "m3", name: "DocYOLO_Entities", description: "YOLOv8 для детекции полей документа", project: projects[2], taskType: "computer_vision", framework: "pytorch", versionsCount: 1, createdAt: "2023-10-05", updatedAt: "2023-10-05" },
  { id: "m4", name: "RetailScoring_LogReg", description: "Бейзлайн логистическая регрессия", project: projects[0], taskType: "classification", framework: "scikit-learn", versionsCount: 0, createdAt: "2024-02-16", updatedAt: "2024-02-16" }
];

const versions: Record<string, ModelVersionDto[]> = {
  m1: [
    { id: "mv1", modelId: "m1", version: "v2.2.0-rc", stage: "staging", latencyP95Ms: 58, author: "Анна Смирнова", createdAt: "2024-04-10", description: "Экспериментальная версия с трансформерными эмбеддингами" },
    { id: "mv2", modelId: "m1", version: "v2.1.0", stage: "production", latencyP95Ms: 45, author: "Анна Смирнова", createdAt: "2024-03-15", description: "Добавлены фичи из БКИ, улучшен ROC-AUC на 3%" },
    { id: "mv3", modelId: "m1", version: "v2.0.0", stage: "archived", latencyP95Ms: 42, author: "Анна Смирнова", createdAt: "2024-01-10", description: "Первая версия с новыми гиперпараметрами" }
  ],
  m2: [{ id: "mv4", modelId: "m2", version: "v1.5.0", stage: "production", latencyP95Ms: 120, author: "Иван Петров", createdAt: "2024-04-01", description: "Оптимизирован инференс (ONNX)" }],
  m3: [{ id: "mv5", modelId: "m3", version: "v4.0.0", stage: "production", latencyP95Ms: 250, author: "Сергей Иванов", createdAt: "2023-10-05", description: "Переход на архитектуру YOLOv8" }],
  m4: []
};

const metrics: Record<string, ModelMetricDto[]> = {
  mv1: [{ key: "accuracy", label: "Accuracy", value: .9, formattedValue: "0.900" }, { key: "f1", label: "F1", value: .85, formattedValue: "0.850" }],
  mv2: [{ key: "accuracy", label: "Accuracy", value: .89, formattedValue: "0.890" }, { key: "f1", label: "F1", value: .84, formattedValue: "0.840" }],
  mv3: [{ key: "accuracy", label: "Accuracy", value: .86, formattedValue: "0.860" }, { key: "f1", label: "F1", value: .81, formattedValue: "0.810" }],
  mv4: [],
  mv5: [{ key: "accuracy", label: "Accuracy", value: .98, formattedValue: "0.980" }, { key: "f1", label: "F1", value: .97, formattedValue: "0.970" }]
};

const artifacts: Record<string, ModelArtifactDto[]> = Object.fromEntries(Object.values(versions).flat().map((version) => [version.id, [
  { id: `${version.id}-model`, name: "model.bin", type: "model", sizeBytes: 18432000, uri: `s3://mlops-artifacts/${version.modelId}/${version.version}/model.bin` },
  { id: `${version.id}-meta`, name: "MLmodel", type: "metadata", sizeBytes: 4096, uri: `s3://mlops-artifacts/${version.modelId}/${version.version}/MLmodel` },
  { id: `${version.id}-env`, name: "requirements.txt", type: "environment", sizeBytes: 2048, uri: `s3://mlops-artifacts/${version.modelId}/${version.version}/requirements.txt` }
]]));

const wait = () => new Promise((resolve) => setTimeout(resolve, 320));
const clone = <T,>(value: T): T => structuredClone(value);

export class MockModelApiError extends Error {
  readonly status = 404;
  constructor(readonly resource: "model" | "version") { super(`${resource} not found`); }
}

function findModel(modelId: string) { const model = models.find((item) => item.id === modelId); if (!model) throw new MockModelApiError("model"); return model; }
function findVersion(modelId: string, versionId: string) { findModel(modelId); const version = (versions[modelId] ?? []).find((item) => item.id === versionId); if (!version) throw new MockModelApiError("version"); return version; }

export const mockModelsApi = {
  async listModels() { await wait(); return clone(models); },
  async createModel(input: CreateModelDto) { await wait(); const project = projects.find((item) => item.id === input.projectId) ?? projects[0]; const now = new Date().toISOString().slice(0, 10); const model: ModelDto = { id: `m${models.length + 1}`, name: input.name.trim(), description: input.description.trim(), project, taskType: input.taskType, framework: input.framework, versionsCount: 0, createdAt: now, updatedAt: now }; models = [...models, model]; versions[model.id] = []; return clone(model); },
  async getModel(modelId: string) { await wait(); return clone(findModel(modelId)); },
  async updateModel(modelId: string, input: UpdateModelDto) { await wait(); const current = findModel(modelId); const project = input.projectId ? projects.find((item) => item.id === input.projectId) ?? current.project : current.project; const updated: ModelDto = { ...current, ...(input.name !== undefined ? { name: input.name.trim() } : {}), ...(input.description !== undefined ? { description: input.description.trim() } : {}), ...(input.taskType ? { taskType: input.taskType } : {}), ...(input.framework ? { framework: input.framework } : {}), project, updatedAt: new Date().toISOString().slice(0, 10) }; models = models.map((item) => item.id === modelId ? updated : item); return clone(updated); },
  async listVersions(modelId: string) { await wait(); findModel(modelId); return clone(versions[modelId] ?? []); },
  async createVersion(modelId: string, input: CreateModelVersionDto) { await wait(); const model = findModel(modelId); const list = versions[modelId] ?? []; const version: ModelVersionDto = { id: `mv${Object.values(versions).flat().length + 1}`, modelId, version: input.version.trim(), stage: input.stage, latencyP95Ms: input.latencyP95Ms ?? null, author: "Анна Смирнова", createdAt: new Date().toISOString().slice(0, 10), description: input.description.trim() }; versions[modelId] = [version, ...list]; models = models.map((item) => item.id === modelId ? { ...item, versionsCount: item.versionsCount + 1, updatedAt: version.createdAt } : item); metrics[version.id] = []; artifacts[version.id] = []; return clone({ ...version, modelId: model.id }); },
  async getVersion(modelId: string, versionId: string) { await wait(); return clone(findVersion(modelId, versionId)); },
  async updateVersionStage(modelId: string, versionId: string, input: UpdateModelVersionStageDto) { await wait(); const current = findVersion(modelId, versionId); const updated = { ...current, stage: input.stage }; versions[modelId] = versions[modelId].map((item) => item.id === versionId ? updated : item); return clone(updated); },
  async getVersionMetrics(modelId: string, versionId: string) { await wait(); findVersion(modelId, versionId); return clone(metrics[versionId] ?? []); },
  async getVersionArtifacts(modelId: string, versionId: string) { await wait(); findVersion(modelId, versionId); return clone(artifacts[versionId] ?? []); }
};
