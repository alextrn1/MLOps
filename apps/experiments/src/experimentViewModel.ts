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
