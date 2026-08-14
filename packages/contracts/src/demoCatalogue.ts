import type { ModelFramework, ModelTaskType, ModelVersionStage, ProjectOwnerDto } from "./index";

export interface DemoProject {
  id: string;
  name: string;
}

export interface DemoModel {
  id: string;
  name: string;
  projectId: string;
  taskType: ModelTaskType;
  framework: ModelFramework;
}

export interface DemoModelVersion {
  id: string;
  modelId: string;
  version: string;
  stage: ModelVersionStage;
}

export interface DemoDataset {
  id: string;
  name: string;
  projectId: string;
  latestVersion: string;
}

export interface DemoDeployment {
  id: string;
  name: string;
  projectId: string;
  modelId: string;
}

export interface DemoIncident {
  id: string;
  title: string;
  deploymentId: string;
}

export const demoUsers: readonly ProjectOwnerDto[] = [
  { id: "u1", name: "Анна Смирнова", title: "Lead DS" },
  { id: "u2", name: "Иван Петров", title: "DS" },
  { id: "u3", name: "Сергей Иванов", title: "Lead DS" },
  { id: "u4", name: "Елена Соколова", title: "DS" }
];

export const demoProjects: readonly DemoProject[] = [
  { id: "p1", name: "Кредитный Скоринг Retail" },
  { id: "p2", name: "Рекомендации товаров e-commerce" },
  { id: "p3", name: "Распознавание документов" },
  { id: "p4", name: "Прогнозирование оттока B2B" }
];

export const demoModels: readonly DemoModel[] = [
  { id: "m1", name: "RetailScoring_XGB", projectId: "p1", taskType: "classification", framework: "xgboost" },
  { id: "m2", name: "TwoTower_RecSys", projectId: "p2", taskType: "recommendation", framework: "pytorch" },
  { id: "m3", name: "DocYOLO_Entities", projectId: "p3", taskType: "computer_vision", framework: "pytorch" },
  { id: "m4", name: "RetailScoring_LogReg", projectId: "p1", taskType: "classification", framework: "scikit-learn" }
];

export const demoModelVersions: readonly DemoModelVersion[] = [
  { id: "mv1", modelId: "m1", version: "v2.2.0-rc", stage: "staging" },
  { id: "mv2", modelId: "m1", version: "v2.1.0", stage: "production" },
  { id: "mv3", modelId: "m1", version: "v2.0.0", stage: "archived" },
  { id: "mv4", modelId: "m2", version: "v1.5.0", stage: "production" },
  { id: "mv5", modelId: "m3", version: "v4.0.0", stage: "production" }
];

export const demoDatasets: readonly DemoDataset[] = [
  { id: "d1", name: "retail_credit_history_v2", projectId: "p1", latestVersion: "2.1.0" },
  { id: "d2", name: "user_interactions_q1", projectId: "p2", latestVersion: "1.0.0" },
  { id: "d3", name: "passport_scans_augmented", projectId: "p3", latestVersion: "4.0.2" },
  { id: "d4", name: "retail_credit_history_v1", projectId: "p1", latestVersion: "1.0.0" }
];

export const demoDeployments: readonly DemoDeployment[] = [
  { id: "dep1", name: "scoring", projectId: "p1", modelId: "m1" },
  { id: "dep2", name: "scoring", projectId: "p1", modelId: "m1" },
  { id: "dep3", name: "recsys", projectId: "p2", modelId: "m2" },
  { id: "dep4", name: "ocr", projectId: "p3", modelId: "m3" }
];

export const demoIncidents: readonly DemoIncident[] = [
  { id: "evt1", title: "Дрейф признака: income_verified", deploymentId: "dep1" },
  { id: "evt2", title: "Всплеск задержки инференса (p99)", deploymentId: "dep3" },
  { id: "evt3", title: "Падение качества: ROC-AUC", deploymentId: "dep1" },
  { id: "evt4", title: "Нетипичный рост трафика", deploymentId: "dep4" },
  { id: "evt5", title: "Рост HTTP 500 ошибок", deploymentId: "dep1" }
];
