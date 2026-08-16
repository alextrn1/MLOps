import type {
  CreateDeploymentDto,
  DeploymentDto,
  DeploymentEventDto,
  DeploymentMetricPointDto,
  DeploymentMetricsDto,
  UpdateDeploymentDto,
  UpdateDeploymentTrafficDto
} from "@mlops/contracts";
import { waitForMockDelay } from "@mlops/api-client";
import { demoModelVersions, demoModels, demoProjects } from "@mlops/contracts";
import type { DeploymentsApi } from "./index";

export class MockDeploymentApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

const delay = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);

let deployments: DeploymentDto[] = [
  { id: "dep1", name: "scoring", status: "active", environment: "production", url: "https://api.internal/ml/v1/scoring", project: { id: "p1", name: "Кредитный Скоринг Retail" }, model: { id: "m1", name: "RetailScoring_XGB" }, modelVersionId: "mv2", modelVersion: "v2.1.0", trafficPercent: 100, deployedAt: "2024-03-20", deployedBy: "CI/CD Pipeline" },
  { id: "dep2", name: "scoring", status: "active", environment: "staging", url: "https://api.staging.internal/ml/v1/scoring", project: { id: "p1", name: "Кредитный Скоринг Retail" }, model: { id: "m1", name: "RetailScoring_XGB" }, modelVersionId: "mv1", modelVersion: "v2.2.0-rc", trafficPercent: 100, deployedAt: "2024-04-11", deployedBy: "Анна Смирнова" },
  { id: "dep3", name: "recsys", status: "active", environment: "production", url: "https://api.internal/ml/v1/recsys", project: { id: "p2", name: "Рекомендации товаров e-commerce" }, model: { id: "m2", name: "TwoTower_RecSys" }, modelVersionId: "mv4", modelVersion: "v1.5.0", trafficPercent: 100, deployedAt: "2024-04-02", deployedBy: "CI/CD Pipeline" },
  { id: "dep4", name: "ocr", status: "active", environment: "production", url: "https://api.internal/ml/v1/ocr", project: { id: "p3", name: "Распознавание документов" }, model: { id: "m3", name: "DocYOLO_Entities" }, modelVersionId: "mv5", modelVersion: "v4.0.0", trafficPercent: 100, deployedAt: "2023-10-10", deployedBy: "CI/CD Pipeline" }
];

const metricSeries: Record<string, { latencies: number[]; requests: number[] }> = {
  dep1: {
    latencies: [48,31,43,46,33,36,30,41,44,39,34,52,178,171,36,34,45,47,31,29,38,32,44,37],
    requests: [1500,1240,1310,1460,1120,1080,1010,1160,1380,1210,1100,1260,6720,6120,1280,1010,1430,1510,1180,1360,1090,1420,1260,980]
  },
  dep2: {
    latencies: [31,44,48,36,43,39,37,40,47,43,32,35,218,194,31,37,46,39,36,35,36,42,33,49],
    requests: [1420,1370,1210,1530,1590,1390,1260,1190,1320,1480,1180,1250,5960,5480,1610,1560,1490,1580,1510,1620,1390,1710,1580,1280]
  },
  dep3: {
    latencies: [34,43,45,37,48,31,46,46,46,38,45,36,184,176,47,43,36,34,40,43,48,30,44,35],
    requests: [1490,1710,1240,1080,1130,1190,1060,1310,1120,1090,1450,1370,5850,6370,1410,1580,1440,1230,1070,1330,1540,1610,1360,1210]
  },
  dep4: {
    latencies: [37,47,34,49,39,48,33,35,42,48,43,31,148,185,46,32,45,45,39,41,33,31,37,29],
    requests: [1520,1090,1410,1280,1230,1120,1340,1270,1290,1080,1130,1200,4820,6030,1260,1190,1470,970,1030,1310,1450,1220,1380,1060]
  }
};

function metricPoints(deploymentId: string): DeploymentMetricPointDto[] {
  const series = metricSeries[deploymentId] ?? metricSeries.dep1;
  return series.latencies.map((latency, index) => {
    const hour = (23 + index) % 24;
    const minute = deploymentId === "dep1" ? 53 : deploymentId === "dep2" ? 54 : 57;
    return {
      timestamp: `2024-04-14T${String(hour).padStart(2, "0")}:${minute}:00Z`,
      timeLabel: `${String(hour).padStart(2, "0")}:${minute}`,
      latencyP95Ms: latency,
      requestsPerHour: series.requests[index],
      errorRatePercent: index === 12 ? 0.08 : 0.02
    };
  });
}

const events: Record<string, DeploymentEventDto[]> = {
  dep1: [
    { id: "evt1", deploymentId: "dep1", title: "Дрейф признака: income_verified", type: "data_drift", severity: "critical", occurredAt: "2024-04-14", monitoringEventId: "evt1" },
    { id: "evt3", deploymentId: "dep1", title: "Падение качества: ROC-AUC", type: "model_degradation", severity: "critical", occurredAt: "2024-04-13", monitoringEventId: "evt3" },
    { id: "evt5", deploymentId: "dep1", title: "Рост HTTP 500 ошибок", type: "error_rate", severity: "critical", occurredAt: "2024-04-10", monitoringEventId: "evt5" }
  ],
  dep2: [],
  dep3: [{ id: "evt6", deploymentId: "dep3", title: "Всплеск задержки инференса (p99)", type: "latency_spike", severity: "warning", occurredAt: "2024-04-14", monitoringEventId: "evt2" }],
  dep4: [{ id: "evt7", deploymentId: "dep4", title: "Нетипичный рост трафика", type: "usage_anomaly", severity: "warning", occurredAt: "2024-04-12", monitoringEventId: "evt4" }]
};

const findDeployment = (id: string) => {
  const deployment = deployments.find((item) => item.id === id);
  if (!deployment) throw new MockDeploymentApiError(404, "Deployment not found");
  return deployment;
};

export const mockDeploymentsApi: DeploymentsApi = {
  async listFormProjects() { return clone(demoProjects); },
  async listFormModels() { return clone(demoModels); },
  async listFormModelVersions(modelId) { return clone(demoModelVersions.filter((version) => version.modelId === modelId)); },
  async listDeployments() { await delay(); return clone(deployments); },
  async createDeployment(input: CreateDeploymentDto) {
    await delay();
    const project = demoProjects.find((item) => item.id === input.projectId);
    const model = demoModels.find((item) => item.id === input.modelId && item.projectId === input.projectId);
    const modelVersion = demoModelVersions.find((item) => item.id === input.modelVersionId && item.modelId === input.modelId);
    if (!project || !model || !modelVersion) throw new MockDeploymentApiError(400, "Invalid deployment relationships");
    const id = `dep${deployments.length + 1}`;
    const created: DeploymentDto = { id, name: input.name, status: "active", environment: input.environment, url: input.url, project: { id: project.id, name: project.name }, model: { id: model.id, name: model.name }, modelVersionId: modelVersion.id, modelVersion: modelVersion.version, trafficPercent: input.trafficPercent, deployedAt: new Date().toISOString().slice(0, 10), deployedBy: "Анна Смирнова" };
    deployments = [...deployments, created]; events[id] = []; return clone(created);
  },
  async getDeployment(id) { await delay(); return clone(findDeployment(id)); },
  async updateDeployment(id, input: UpdateDeploymentDto) { await delay(); const current = findDeployment(id); Object.assign(current, input); return clone(current); },
  async restartDeployment(id) { await delay(); const current = findDeployment(id); current.status = "active"; events[id] = [{ id: `restart-${Date.now()}`, deploymentId: id, title: "Deployment перезапущен", type: "restart", severity: "info", occurredAt: new Date().toISOString().slice(0, 10), monitoringEventId: null }, ...(events[id] ?? [])]; return clone(current); },
  async rollbackDeployment(id) { await delay(); const current = findDeployment(id); current.modelVersion = `${current.modelVersion}-rollback`; events[id] = [{ id: `rollback-${Date.now()}`, deploymentId: id, title: "Выполнен откат версии", type: "rollback", severity: "warning", occurredAt: new Date().toISOString().slice(0, 10), monitoringEventId: null }, ...(events[id] ?? [])]; return clone(current); },
  async updateTraffic(id, input: UpdateDeploymentTrafficDto) { await delay(); const current = findDeployment(id); current.trafficPercent = Math.max(0, Math.min(100, input.trafficPercent)); return clone(current); },
  async getMetrics(id): Promise<DeploymentMetricsDto> { await delay(); findDeployment(id); return { deploymentId: id, averageLatencyP95Ms: 42.5, trafficPercent: findDeployment(id).trafficPercent, errorRatePercent: 0.02, points: metricPoints(id) }; },
  async getEvents(id) { await delay(); findDeployment(id); return clone(events[id] ?? []); }
};
