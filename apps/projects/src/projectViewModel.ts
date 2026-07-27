import type { ProjectStatus } from "@mlops/contracts";

export const projectStatusOptions: ReadonlyArray<{ value: ProjectStatus; label: string; detailLabel: string; tone: "success" | "info" | "warning" }> = [
  { value: "active", label: "Активен", detailLabel: "active", tone: "success" },
  { value: "completed", label: "Завершён", detailLabel: "completed", tone: "info" },
  { value: "paused", label: "Приостановлен", detailLabel: "paused", tone: "warning" }
];

export const formatProjectDate = (date: string) => new Intl.DateTimeFormat("ru-RU").format(new Date(`${date}T00:00:00`));
export const getProjectStatus = (status: ProjectStatus) => projectStatusOptions.find((item) => item.value === status) ?? projectStatusOptions[0];

export const summaryCards = [
  { key: "models", label: "Модели", icon: "box", iconTone: "violet", href: "/models" },
  { key: "datasets", label: "Датасеты", icon: "database", iconTone: "cyan", href: "/datasets" },
  { key: "experiments", label: "Эксперименты", icon: "activity", iconTone: "slate", href: "/experiments" },
  { key: "deployments", label: "Развёртывания", icon: "server", iconTone: "green", href: "/deployments" }
] as const;
