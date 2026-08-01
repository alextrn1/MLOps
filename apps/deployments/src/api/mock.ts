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
import type { DeploymentsApi } from "./index";

export class MockDeploymentApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

const delay = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);

let deployments: DeploymentDto[] = [
  { id: "dep1", name: "scoring", status: "active", environment: "production", url: "https://api.internal/ml/v1/scoring", project: { id: "p1", name: "Кредитный Скоринг Retail" }, model: { id: "m1", name: "RetailScoring_XGB" }, modelVersionId: "v210", modelVersion: "v2.1.0", trafficPercent: 100, deployedAt: "2024-03-20", deployedBy: "CI/CD Pipeline" },
  { id: "dep2", name: "scoring", status: "active", environment: "staging", url: "https://api.staging.internal/ml/v1/scoring", project: { id: "p1", name: "Кредитный Скоринг Retail" }, model: { id: "m1", name: "RetailScoring_XGB" }, modelVersionId: "v220rc", modelVersion: "v2.2.0-rc", trafficPercent: 100, deployedAt: "2024-04-11", deployedBy: "Анна Смирнова" },
  { id: "dep3", name: "recsys", status: "active", environment: "production", url: "https://api.internal/ml/v1/recsys", project: { id: "p2", name: "Рекомендации товаров e-commerce" }, model: { id: "m2", name: "TwoTower_RecSys" }, modelVersionId: "v150", modelVersion: "v1.5.0", trafficPercent: 100, deployedAt: "2024-04-02", deployedBy: "CI/CD Pipeline" },
  { id: "dep4", name: "ocr", status: "active", environment: "production", url: "https://api.internal/ml/v1/ocr", project: { id: "p3", name: "Распознавание документов" }, model: { id: "m3", name: "DocYOLO_Entities" }, modelVersionId: "v400", modelVersion: "v4.0.0", trafficPercent: 100, deployedAt: "2023-10-10", deployedBy: "CI/CD Pipeline" }
];

const baseLatencies = [48,34,41,46,37,43,45,39,42,38,48,35,42,40,44,36,49,38,41,39,47,42,36,33];
const baseRequests = [1800,1650,1720,1880,1590,1810,1750,1640,1830,1680,1900,1620,1740,1710,1800,1650,1880,1690,1760,1680,1910,1790,1700,1660];

function metricPoints(deploymentId: string): DeploymentMetricPointDto[] {
  const offset = deploymentId === "dep2" ? 1 : deploymentId === "dep3" ? 4 : deploymentId === "dep4" ? 7 : 0;
  return baseLatencies.map((latency, index) => {
    const spike = index === 12 ? 190 + offset * 6 : index === 13 ? 165 + offset * 4 : 0;
    const hour = (23 + index) % 24;
    const minute = deploymentId === "dep1" ? 53 : deploymentId === "dep2" ? 54 : 57;
    return {
      timestamp: `2024-04-14T${String(hour).padStart(2, "0")}:${minute}:00Z`,
      timeLabel: `${String(hour).padStart(2, "0")}:${minute}`,
      latencyP95Ms: spike || latency + offset,
      requestsPerHour: spike ? 5564 + offset * 80 : baseRequests[index] + offset * 25,
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
  dep3: [{ id: "evt6", deploymentId: "dep3", title: "Всплеск задержки инференса (p99)", type: "latency_spike", severity: "warning", occurredAt: "2024-04-14", monitoringEventId: "evt6" }],
  dep4: [{ id: "evt7", deploymentId: "dep4", title: "Нетипичный рост трафика", type: "usage_anomaly", severity: "warning", occurredAt: "2024-04-12", monitoringEventId: "evt7" }]
};

const findDeployment = (id: string) => {
  const deployment = deployments.find((item) => item.id === id);
  if (!deployment) throw new MockDeploymentApiError(404, "Deployment not found");
  return deployment;
};

export const mockDeploymentsApi: DeploymentsApi = {
  async listDeployments() { await delay(); return clone(deployments); },
  async createDeployment(input: CreateDeploymentDto) {
    await delay();
    const id = `dep${deployments.length + 1}`;
    const created: DeploymentDto = { id, name: input.name, status: "active", environment: input.environment, url: input.url, project: { id: input.projectId, name: input.projectId === "p2" ? "Рекомендации товаров e-commerce" : input.projectId === "p3" ? "Распознавание документов" : "Кредитный Скоринг Retail" }, model: { id: input.modelId, name: input.modelId === "m2" ? "TwoTower_RecSys" : input.modelId === "m3" ? "DocYOLO_Entities" : "RetailScoring_XGB" }, modelVersionId: input.modelVersionId, modelVersion: input.modelVersionId, trafficPercent: input.trafficPercent, deployedAt: new Date().toISOString().slice(0, 10), deployedBy: "Анна Смирнова" };
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
