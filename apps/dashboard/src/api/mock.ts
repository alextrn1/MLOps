import type { DashboardActivityDto, DashboardIncidentsDto, DashboardSummaryDto } from "./types";

const summary: DashboardSummaryDto = {
  metrics: [
    { id: "active-projects", kind: "active-projects", label: "Активные проекты", value: 2, caption: "Из 4 всего" },
    { id: "models", kind: "models", label: "Модели в реестре", value: 4, caption: "+2 за последнюю неделю" },
    { id: "deployments", kind: "deployments", label: "Развёртывания (Prod/Staging)", value: 4, caption: "Все endpoints доступны" },
    { id: "critical-alerts", kind: "critical-alerts", label: "Критичные алерты", value: 1, caption: "Требуют внимания" }
  ]
};

const incidents: DashboardIncidentsDto = {
  items: [
    { id: "evt3", title: "Падение качества: ROC-AUC", description: "Estimated ROC-AUC: 0.83 (Порог: 0.85)", detectedAt: "13:00", severity: "critical" },
    { id: "evt1", title: "Дрейф признака: income_verified", description: "PSI (income_verified): 0.24 (Порог: 0.2)", detectedAt: "11:30", severity: "warning" }
  ]
};

const activity: DashboardActivityDto = {
  deployments: [
    { id: "dep4", endpoint: "ocr", deployedAt: "10.10.2023", author: "CI/CD Pipeline", environment: "production" },
    { id: "dep3", endpoint: "recsys", deployedAt: "02.04.2024", author: "CI/CD Pipeline", environment: "production" },
    { id: "dep2", endpoint: "scoring", deployedAt: "11.04.2024", author: "Анна Смирнова", environment: "staging" },
    { id: "dep1", endpoint: "scoring", deployedAt: "20.03.2024", author: "CI/CD Pipeline", environment: "production" }
  ]
};

const wait = (delay = 420) => new Promise<void>((resolve) => window.setTimeout(resolve, delay));

export async function getMockSummary() {
  await wait();
  return structuredClone(summary);
}

export async function getMockActivity() {
  await wait();
  return structuredClone(activity);
}

export async function getMockIncidents() {
  await wait();
  return structuredClone(incidents);
}
