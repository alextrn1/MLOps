import type { AlertRuleDto, CreateAlertRuleDto, CreateIncidentCommentDto, IncidentDto, IncidentTimelineEventDto, UpdateAlertRuleDto } from "@mlops/contracts";
import { waitForMockDelay } from "@mlops/api-client";
import type { MonitoringApi } from "./index";

export class MockMonitoringApiError extends Error { constructor(public readonly status: number, message: string) { super(message); } }
const delay = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);
const integrations = (incidentId: string, grafana = true, logs = true): IncidentDto["integrations"] => ({
  grafanaUrl: grafana ? `https://grafana.demo.local/d/mlops-incidents/${incidentId}` : null,
  logsUrl: logs ? `https://logs.demo.local/incidents/${incidentId}` : null
});

let incidents: IncidentDto[] = [
  { id: "evt2", title: "Всплеск задержки инференса (p99)", description: "p99 latency превысила 200мс в течение последних 15 минут. Наблюдается деградация пользовательского опыта.", type: "latency_spike", typeLabel: "Задержки", severity: "critical", status: "acknowledged", deployment: { id: "dep3", name: "recsys", url: "https://api.internal/ml/v1/recsys", environment: "production" }, project: { id: "p2", name: "Рекомендации товаров e-commerce" }, metric: { label: "Latency p99 (ms)", value: 245, formattedValue: "245", threshold: 150, formattedThreshold: "150", tone: "danger" }, integrations: integrations("evt2"), detectedAt: "2024-04-14T14:45:00", resolvedAt: null, resolvedBy: null },
  { id: "evt1", title: "Дрейф признака: income_verified", description: "Распределение признака income_verified значительно отклонилось от обучающей выборки (PSI = 0.24). Возможна проблема с интеграцией поставщика данных.", type: "data_drift", typeLabel: "Дрейф данных", severity: "warning", status: "open", deployment: { id: "dep1", name: "scoring", url: "https://api.internal/ml/v1/scoring", environment: "production" }, project: { id: "p1", name: "Кредитный Скоринг Retail" }, metric: { label: "PSI (income_verified)", value: .24, formattedValue: "0.24", threshold: .2, formattedThreshold: "0.2", tone: "warning" }, integrations: integrations("evt1"), detectedAt: "2024-04-14T11:30:00", resolvedAt: null, resolvedBy: null },
  { id: "evt3", title: "Падение качества: ROC-AUC", description: "Оценочный ROC-AUC на отложенной выборке (задержка меток 30 дней) упал ниже порога 0.85.", type: "model_degradation", typeLabel: "Деградация модели", severity: "critical", status: "open", deployment: { id: "dep1", name: "scoring", url: "https://api.internal/ml/v1/scoring", environment: "production" }, project: { id: "p1", name: "Кредитный Скоринг Retail" }, metric: { label: "Estimated ROC-AUC", value: .83, formattedValue: "0.83", threshold: .85, formattedThreshold: "0.85", tone: "danger" }, integrations: integrations("evt3", true, false), detectedAt: "2024-04-13T13:00:00", resolvedAt: null, resolvedBy: null },
  { id: "evt4", title: "Нетипичный рост трафика", description: "Количество запросов выросло на 400% по сравнению с аналогичным периодом прошлой недели.", type: "usage_anomaly", typeLabel: "Аномалия трафика", severity: "warning", status: "resolved", deployment: { id: "dep4", name: "ocr", url: "https://api.internal/ml/v1/ocr", environment: "production" }, project: { id: "p3", name: "Распознавание документов" }, metric: { label: "RPS", value: 1250, formattedValue: "1250", threshold: 500, formattedThreshold: "500", tone: "warning" }, integrations: integrations("evt4", false, false), detectedAt: "2024-04-12T12:00:00", resolvedAt: "2024-04-12T13:30:00", resolvedBy: "System" },
  { id: "evt5", title: "Рост HTTP 500 ошибок", description: "Доля ответов с кодом 500 превысила 1%. Ошибка в сериализации признаков.", type: "error_rate", typeLabel: "Ошибки", severity: "critical", status: "resolved", deployment: { id: "dep1", name: "scoring", url: "https://api.internal/ml/v1/scoring", environment: "production" }, project: { id: "p1", name: "Кредитный Скоринг Retail" }, metric: { label: "Error Rate (%)", value: 1.5, formattedValue: "1.5", threshold: .5, formattedThreshold: "0.5", tone: "danger" }, integrations: integrations("evt5", false, true), detectedAt: "2024-04-10T17:00:00", resolvedAt: "2024-04-10T17:45:00", resolvedBy: "Анна Смирнова" }
];

const timeline: Record<string, IncidentTimelineEventDto[]> = Object.fromEntries(incidents.map((item) => [item.id, [{ id: `${item.id}-created`, incidentId: item.id, type: "created", author: "System", message: "Инцидент обнаружен", createdAt: item.detectedAt }]]));
let alertRules: AlertRuleDto[] = [
  { id: "rule1", name: "Высокая задержка p99", incidentType: "latency_spike", metric: "latency_p99_ms", operator: "gt", threshold: 200, enabled: true, deploymentId: null },
  { id: "rule2", name: "Деградация ROC-AUC", incidentType: "model_degradation", metric: "roc_auc", operator: "lt", threshold: .85, enabled: true, deploymentId: "dep1" }
];
const findIncident = (id: string) => { const value = incidents.find((item) => item.id === id); if (!value) throw new MockMonitoringApiError(404, "Incident not found"); return value; };
const addTimeline = (incident: IncidentDto, type: IncidentTimelineEventDto["type"], message: string) => { const event: IncidentTimelineEventDto = { id: `${incident.id}-${type}-${Date.now()}`, incidentId: incident.id, type, author: "Анна Смирнова", message, createdAt: new Date().toISOString() }; timeline[incident.id] = [...(timeline[incident.id] ?? []), event]; return event; };

export const mockMonitoringApi: MonitoringApi = {
  async listIncidents() { await delay(); return clone(incidents); },
  async getIncident(id) { await delay(); return clone(findIncident(id)); },
  async acknowledgeIncident(id) { await delay(); const incident = findIncident(id); if (incident.status === "resolved") throw new MockMonitoringApiError(409, "Resolved incident cannot be acknowledged"); incident.status = "acknowledged"; addTimeline(incident, "acknowledged", "Инцидент взят в работу"); return clone(incident); },
  async resolveIncident(id) { await delay(); const incident = findIncident(id); incident.status = "resolved"; incident.resolvedAt = new Date().toISOString(); incident.resolvedBy = "Анна Смирнова"; addTimeline(incident, "resolved", "Инцидент отмечен как решённый"); return clone(incident); },
  async reopenIncident(id) { await delay(); const incident = findIncident(id); incident.status = "open"; incident.resolvedAt = null; incident.resolvedBy = null; addTimeline(incident, "reopened", "Инцидент переоткрыт"); return clone(incident); },
  async getTimeline(id) { await delay(); findIncident(id); return clone(timeline[id] ?? []); },
  async addComment(id, input: CreateIncidentCommentDto) { await delay(); const incident = findIncident(id); return clone(addTimeline(incident, "comment", input.message)); },
  async listAlertRules() { await delay(); return clone(alertRules); },
  async createAlertRule(input: CreateAlertRuleDto) { await delay(); const created: AlertRuleDto = { id: `rule${Date.now()}`, ...input }; alertRules = [...alertRules, created]; return clone(created); },
  async updateAlertRule(id, input: UpdateAlertRuleDto) { await delay(); const rule = alertRules.find((item) => item.id === id); if (!rule) throw new MockMonitoringApiError(404, "Alert rule not found"); Object.assign(rule, input); return clone(rule); },
  async deleteAlertRule(id) { await delay(); if (!alertRules.some((item) => item.id === id)) throw new MockMonitoringApiError(404, "Alert rule not found"); alertRules = alertRules.filter((item) => item.id !== id); }
};
