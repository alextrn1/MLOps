import type { CreateExperimentDto, ExperimentArtifactDto, ExperimentDto, ExperimentLogLineDto, ExperimentMetricDto, ExperimentParameterDto } from "@mlops/contracts";

const projects = {
  p1: { id: "p1", name: "Кредитный Скоринг Retail" },
  p2: { id: "p2", name: "Рекомендации товаров e-commerce" },
  p4: { id: "p4", name: "Прогнозирование оттока B2B" }
};
const models = {
  m1: { id: "m1", name: "RetailScoring_XGB" },
  m2: { id: "m2", name: "TwoTower_RecSys" }
};
const datasets = {
  d1: { id: "d1", name: "retail_credit_history_v2", version: "2.1.0" },
  d2: { id: "d2", name: "user_interactions_q1", version: "1.0.0" }
};

let experiments: ExperimentDto[] = [
  { id: "e3", name: "twotower_embeddings_128", status: "running", project: projects.p2, model: models.m2, modelVersionId: null, dataset: datasets.d2, startedAt: "2024-04-14T13:00:00", completedAt: null, durationSeconds: null, keyMetric: { key: "hit_rate_at_10", label: "HIT_RATE_AT_10", value: .245, formattedValue: "0.2450" } },
  { id: "e2", name: "xgb_bki_features_deep", status: "completed", project: projects.p1, model: models.m1, modelVersionId: "mv1", dataset: datasets.d1, startedAt: "2024-03-13T04:00:00", completedAt: "2024-03-13T09:30:00", durationSeconds: 19800, keyMetric: { key: "roc_auc", label: "ROC_AUC", value: .908, formattedValue: "0.9080" } },
  { id: "e1", name: "xgb_bki_features_tuning", status: "completed", project: projects.p1, model: models.m1, modelVersionId: "mv2", dataset: datasets.d1, startedAt: "2024-03-12T23:00:00", completedAt: "2024-03-13T02:45:00", durationSeconds: 13500, keyMetric: { key: "roc_auc", label: "ROC_AUC", value: .912, formattedValue: "0.9120" } },
  { id: "e4", name: "churn_rf_baseline", status: "failed", project: projects.p4, model: null, modelVersionId: null, dataset: datasets.d1, startedAt: "2024-02-21T12:00:00", completedAt: "2024-02-21T12:15:00", durationSeconds: 900, keyMetric: null }
];

const metrics: Record<string, ExperimentMetricDto[]> = {
  e3: [{ key: "hit_rate_at_10", label: "HIT_RATE_AT_10", value: .245, formattedValue: "0.2450" }, { key: "ndcg_at_10", label: "NDCG_AT_10", value: .189, formattedValue: "0.1890" }],
  e2: [{ key: "roc_auc", label: "ROC_AUC", value: .908, formattedValue: "0.9080" }, { key: "pr_auc", label: "PR_AUC", value: .849, formattedValue: "0.8490" }, { key: "logloss", label: "LOGLOSS", value: .32, formattedValue: "0.3200" }],
  e1: [{ key: "roc_auc", label: "ROC_AUC", value: .912, formattedValue: "0.9120" }, { key: "pr_auc", label: "PR_AUC", value: .854, formattedValue: "0.8540" }, { key: "logloss", label: "LOGLOSS", value: .312, formattedValue: "0.3120" }],
  e4: []
};
const parameters: Record<string, ExperimentParameterDto[]> = {
  e3: [{ key: "embedding_dim", value: 128 }, { key: "batch_size", value: 1024 }, { key: "lr", value: .001 }],
  e2: [{ key: "max_depth", value: 8 }, { key: "learning_rate", value: .01 }, { key: "n_estimators", value: 1000 }, { key: "subsample", value: .8 }],
  e1: [{ key: "max_depth", value: 6 }, { key: "learning_rate", value: .05 }, { key: "n_estimators", value: 500 }, { key: "subsample", value: .8 }],
  e4: [{ key: "n_estimators", value: 100 }]
};
const artifacts: Record<string, ExperimentArtifactDto[]> = {
  e1: [{ id: "a1", name: "metrics.json", kind: "report", sizeBytes: 4096, uri: "s3://mlops/experiments/e1/metrics.json" }, { id: "a2", name: "model.pkl", kind: "model", sizeBytes: 18350080, uri: "s3://mlops/experiments/e1/model.pkl" }],
  e2: [{ id: "a3", name: "evaluation.json", kind: "report", sizeBytes: 6144, uri: "s3://mlops/experiments/e2/evaluation.json" }],
  e3: [], e4: []
};
const logs: Record<string, ExperimentLogLineDto[]> = {
  e1: [{ id: "l1", timestamp: "2024-03-12T23:00:02", level: "info", message: "Training job started" }, { id: "l2", timestamp: "2024-03-13T02:44:51", level: "info", message: "Validation ROC-AUC: 0.9120" }, { id: "l3", timestamp: "2024-03-13T02:45:00", level: "info", message: "Run completed successfully" }],
  e2: [{ id: "l4", timestamp: "2024-03-13T04:00:03", level: "info", message: "Loaded retail_credit_history_v2" }, { id: "l5", timestamp: "2024-03-13T09:30:00", level: "info", message: "Run completed successfully" }],
  e3: [{ id: "l6", timestamp: "2024-04-14T13:00:01", level: "info", message: "Embedding training started" }, { id: "l7", timestamp: "2024-04-14T13:12:19", level: "info", message: "Current hit_rate_at_10: 0.2450" }],
  e4: [{ id: "l8", timestamp: "2024-02-21T12:15:00", level: "error", message: "Training stopped: target column contains missing values" }]
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 300));
const clone = <T,>(value: T): T => structuredClone(value);
export class MockExperimentApiError extends Error { readonly status = 404; constructor() { super("experiment not found"); } }
function find(id: string) { const item = experiments.find((experiment) => experiment.id === id); if (!item) throw new MockExperimentApiError(); return item; }

export const mockExperimentsApi = {
  async listExperiments() { await wait(); return clone(experiments); },
  async createExperiment(input: CreateExperimentDto) { await wait(); const id = `e${experiments.length + 1}`; const experiment: ExperimentDto = { id, name: input.name.trim(), status: "running", project: projects[input.projectId as keyof typeof projects] ?? projects.p1, model: models[input.modelId as keyof typeof models] ?? models.m1, modelVersionId: null, dataset: datasets[input.datasetId as keyof typeof datasets] ?? datasets.d1, startedAt: new Date().toISOString().slice(0, 19), completedAt: null, durationSeconds: null, keyMetric: null }; experiments = [experiment, ...experiments]; metrics[id] = []; parameters[id] = []; artifacts[id] = []; logs[id] = [{ id: `${id}-log`, timestamp: experiment.startedAt, level: "info", message: "Training job queued" }]; return clone(experiment); },
  async getExperiment(id: string) { await wait(); return clone(find(id)); },
  async cancelExperiment(id: string) { await wait(); const current = find(id); if (current.status !== "running" && current.status !== "queued" && current.status !== "pending") return clone(current); const updated = { ...current, status: "cancelled" as const, completedAt: new Date().toISOString().slice(0, 19) }; experiments = experiments.map((item) => item.id === id ? updated : item); return clone(updated); },
  async retryExperiment(id: string) { await wait(); const current = find(id); const retried: ExperimentDto = { ...current, id: `e${experiments.length + 1}`, name: `${current.name}_retry`, status: "running", startedAt: new Date().toISOString().slice(0, 19), completedAt: null, durationSeconds: null, keyMetric: null, modelVersionId: null }; experiments = [retried, ...experiments]; metrics[retried.id] = []; parameters[retried.id] = clone(parameters[id] ?? []); artifacts[retried.id] = []; logs[retried.id] = [{ id: `${retried.id}-log`, timestamp: retried.startedAt, level: "info", message: "Retry started" }]; return clone(retried); },
  async getMetrics(id: string) { await wait(); find(id); return clone(metrics[id] ?? []); },
  async getParameters(id: string) { await wait(); find(id); return clone(parameters[id] ?? []); },
  async getArtifacts(id: string) { await wait(); find(id); return clone(artifacts[id] ?? []); },
  async getLogs(id: string) { await wait(); find(id); return clone(logs[id] ?? []); }
};
