import {
  Activity,
  ArrowLeft,
  Bell,
  BarChart3,
  Box,
  CalendarDays,
  Clock3,
  Columns3,
  CheckCircle2,
  CircleAlert,
  Database,
  Edit3,
  ExternalLink,
  FileBox,
  Filter,
  FolderKanban,
  Gauge,
  GitBranch,
  Grid2X2,
  LayoutDashboard,
  Package,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search as SearchIcon,
  Server,
  Settings,
  SlidersHorizontal,
  Tag,
  Terminal,
  TriangleAlert,
  type LucideIcon
} from "lucide-react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { useDelayedLoading } from "./hooks";

const icons = {
  activity: Activity,
  chart: BarChart3,
  arrowLeft: ArrowLeft,
  bell: Bell,
  box: Box,
  calendar: CalendarDays,
  clock: Clock3,
  columns: Columns3,
  database: Database,
  edit: Edit3,
  externalLink: ExternalLink,
  file: FileBox,
  filter: Filter,
  folder: FolderKanban,
  grid: Grid2X2,
  gauge: Gauge,
  gitBranch: GitBranch,
  layout: LayoutDashboard,
  package: Package,
  play: Play,
  plus: Plus,
  refresh: RefreshCw,
  rollback: RotateCcw,
  success: CheckCircle2,
  alert: CircleAlert,
  search: SearchIcon,
  server: Server,
  settings: Settings,
  sliders: SlidersHorizontal,
  tag: Tag,
  terminal: Terminal,
  triangleAlert: TriangleAlert
} satisfies Record<string, LucideIcon>;

export type AppIconName = keyof typeof icons;

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function AppIcon({ name, size = 18, strokeWidth = 1.8, className, ...props }: AppIconProps) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card ${className}`.trim()} {...props} />;
}

export function StatusBadge({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "info" | "danger" | "success" | "warning" | "neutral" }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`ui-button ui-button--${variant} ${className}`.trim()} {...props} />;
}

type TextFieldProps =
  | (InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; textarea?: false })
  | (TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; textarea: true });

export function TextField({ label, error, textarea = false, className = "", ...props }: TextFieldProps) {
  const controlClass = `ui-field__control ${error ? "ui-field__control--error" : ""}`.trim();
  return (
    <label className={`ui-field ${className}`.trim()}>
      <span className="ui-field__label">{label}</span>
      {textarea
        ? <textarea className={controlClass} {...props as TextareaHTMLAttributes<HTMLTextAreaElement>} />
        : <input className={controlClass} {...props as InputHTMLAttributes<HTMLInputElement>} />}
      {error ? <span className="ui-field__error">{error}</span> : null}
    </label>
  );
}

export function SelectField({ label, error, children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <label className={`ui-field ${className}`.trim()}>
      <span className="ui-field__label">{label}</span>
      <select className={`ui-field__control ui-field__select ${error ? "ui-field__control--error" : ""}`.trim()} {...props}>{children}</select>
      {error ? <span className="ui-field__error">{error}</span> : null}
    </label>
  );
}

export function Notice({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" }) {
  return <div className={`ui-notice ui-notice--${tone}`} role={tone === "error" ? "alert" : "status"}><AppIcon name={tone === "success" ? "success" : "alert"} size={18} aria-hidden /><span>{children}</span></div>;
}

export function LoadingState({ label = "Загрузка данных…" }: { label?: string }) {
  return <div className="ui-state" role="status"><span className="ui-spinner" aria-hidden="true" /><span>{label}</span></div>;
}

export function DelayedLoadingState({ loading = true, label, delayMs = 200 }: { loading?: boolean; label?: string; delayMs?: number }) {
  const visible = useDelayedLoading(loading, delayMs);
  return visible ? <LoadingState label={label} /> : null;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="ui-state"><AppIcon name="package" size={24} aria-hidden /><strong>{title}</strong><span>{description}</span></div>;
}

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry: () => void }) {
  return <div className="ui-state ui-state--error" role="alert"><AppIcon name="alert" size={26} aria-hidden /><strong>{title}</strong><span>{description}</span><button type="button" onClick={onRetry}>Повторить</button></div>;
}
