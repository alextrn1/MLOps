export const formatDate = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
export const environmentLabel = (value: "production" | "staging") => value.toUpperCase();
