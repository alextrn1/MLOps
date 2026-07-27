import type { ModelFramework, ModelTaskType, ModelVersionStage } from "@mlops/contracts";

export const taskOptions: ReadonlyArray<{ value: ModelTaskType; label: string }> = [
  { value: "classification", label: "classification" },
  { value: "recommendation", label: "recommendation" },
  { value: "computer_vision", label: "computer_vision" }
];
export const frameworkOptions: ReadonlyArray<{ value: ModelFramework; label: string }> = [
  { value: "xgboost", label: "xgboost" },
  { value: "pytorch", label: "pytorch" },
  { value: "scikit-learn", label: "scikit-learn" }
];
export const stageOptions: ReadonlyArray<{ value: ModelVersionStage; label: string; tone: "warning" | "success" | "neutral" }> = [
  { value: "staging", label: "Staging", tone: "warning" },
  { value: "production", label: "Production", tone: "success" },
  { value: "archived", label: "Archived", tone: "neutral" }
];
export const getStage = (stage: ModelVersionStage) => stageOptions.find((item) => item.value === stage) ?? stageOptions[2];
export const formatDate = (date: string) => new Intl.DateTimeFormat("ru-RU").format(new Date(`${date}T00:00:00`));
export const formatBytes = (bytes: number) => bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.ceil(bytes / 1_000)} KB`;
