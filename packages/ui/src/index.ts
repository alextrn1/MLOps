export * from "./components";

export const uiTokens = {
  color: {
    primary: "#493cdd",
    primaryHover: "#3e32c9",
    info: "#0d9fbd",
    danger: "#ef4343",
    success: "#00c96b",
    warning: "#f2ad00",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f1729",
    muted: "#64748b",
    border: "#e1e7ef",
    sidebar: "#0f1729",
    sidebarActive: "#16213c"
  },
  radius: {
    card: "12px",
    control: "8px"
  }
} as const;

export const sectionTitles = {
  dashboard: "Дашборд",
  projects: "Проекты",
  models: "Модели",
  experiments: "Эксперименты",
  datasets: "Датасеты",
  deployments: "Развёртывания",
  monitoring: "Мониторинг"
} as const;
