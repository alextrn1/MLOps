export * from "./components";
export * from "./hooks";

export const uiTokens = {
  color: {
    primary: { 50: "#f0efff", 100: "#e4e1ff", 500: "#5749ff", 600: "#493cdd", 700: "#3e32c9" },
    info: "#0d9fbd",
    danger: "#ef4343",
    success: "#00c96b",
    warning: "#f2ad00",
    canvas: "#f8fafc",
    surface: "#ffffff",
    text: "#0f1729",
    muted: "#64748b",
    subtle: "#94a3b8",
    placeholder: "#b0bac9",
    border: "#e1e7ef",
    sidebar: "#0f1729",
    sidebarBorder: "#141f38",
    sidebarText: "#9aa6ba",
    sidebarActive: "#16213c"
  },
  typography: {
    family: '"Plus Jakarta Sans", sans-serif',
    size: { xs: "12px", sm: "14px", md: "16px", lg: "18px", xl: "24px" },
    lineHeight: { xs: "16px", sm: "20px", md: "24px", xl: "32px" },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    headingTracking: "-0.025em"
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 10: "40px", 12: "48px" },
  layout: { sidebarWidth: "256px", compactSidebarWidth: "72px", headerHeight: "56px", contentPadding: "24px" },
  control: { sm: "36px", md: "40px", lg: "44px" },
  icon: { sm: "16px", md: "18px", lg: "20px", xl: "24px" },
  radius: {
    card: "12px",
    panel: "8px",
    control: "6px",
    pill: "999px"
  },
  shadow: { control: "0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)", card: "0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)" },
  zIndex: { header: 20, sidebar: 30, dropdown: 50, modal: 100 }
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
