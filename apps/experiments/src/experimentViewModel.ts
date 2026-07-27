import type { ExperimentStatus } from "@mlops/contracts";

export const experimentStatusView: Record<ExperimentStatus, { label: string; tone: "warning" | "success" | "danger" | "neutral" | "info" }> = {
  pending: { label: "Ожидает", tone: "neutral" },
  queued: { label: "В очереди", tone: "info" },
  running: { label: "Выполняется", tone: "warning" },
  completed: { label: "Успешно", tone: "success" },
  failed: { label: "Ошибка", tone: "danger" },
  cancelled: { label: "Отменён", tone: "neutral" }
};

export const formatDuration = (seconds: number | null) => {
  if (seconds === null) return "...";
  const hours = Math.floor(seconds / 3600); const minutes = Math.floor(seconds % 3600 / 60);
  return hours ? `${hours}ч ${minutes}м` : `${minutes}м`;
};
export const formatListDate = (iso: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)).replace(" г.", "");
export const formatDetailDate = (iso: string | null) => iso ? new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(iso)).replace(" г.", "") : "—";
export const formatBytes = (bytes: number) => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} МБ` : `${Math.ceil(bytes / 1024)} КБ`;

export const projectOptions = [
  { id: "p1", name: "Кредитный Скоринг Retail" },
  { id: "p2", name: "Рекомендации товаров e-commerce" },
  { id: "p4", name: "Прогнозирование оттока B2B" }
];
export const modelOptions = [{ id: "m1", name: "RetailScoring_XGB" }, { id: "m2", name: "TwoTower_RecSys" }];
export const datasetOptions = [{ id: "d1", name: "retail_credit_history_v2 · 2.1.0" }, { id: "d2", name: "user_interactions_q1 · 1.0.0" }];
