import type { IncidentStatus } from "@mlops/contracts";
export const statusLabel = (status: IncidentStatus) => status === "open" ? "Открыт" : status === "acknowledged" ? "В работе" : "Решён";
export const formatDetectedShort = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)).replace(" г.", "");
export const formatDateTime = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)).replace(" г.", "");
