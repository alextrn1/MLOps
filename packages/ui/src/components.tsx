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
  FormEventHandler,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TableHTMLAttributes,
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

export function AppShell({ sidebar, header, children, className = "" }: { sidebar: ReactNode; header: ReactNode; children: ReactNode; className?: string }) {
  return <div className={`ui-app-shell ${className}`.trim()}>{sidebar}<div className="ui-app-shell__content">{header}<main className="ui-app-shell__route">{children}</main></div></div>;
}

export function Sidebar({ brand, label, footer, children, className = "" }: { brand: ReactNode; label?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  return <aside className={`ui-sidebar ${className}`.trim()}><div className="ui-sidebar__brand">{brand}</div><div className="ui-sidebar__body">{label ? <div className="ui-sidebar__label">{label}</div> : null}{children}</div>{footer}</aside>;
}

export function Header({ children, actions, className = "" }: { children: ReactNode; actions?: ReactNode; className?: string }) {
  return <header className={`ui-header ${className}`.trim()}>{children}{actions}</header>;
}

export function Search({ className = "", inputClassName = "", onSubmit, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit"> & { inputClassName?: string; onSubmit?: FormEventHandler<HTMLFormElement> }) {
  return <form className={`ui-search ${className}`.trim()} role="search" onSubmit={onSubmit}><AppIcon name="search" size={18} aria-hidden /><input className={`ui-search__input ${inputClassName}`.trim()} {...props} /></form>;
}

export function SidebarItem({ icon, label, badge, active = false, className = "" }: { icon: ReactNode; label: ReactNode; badge?: ReactNode; active?: boolean; className?: string }) {
  return <span className={`ui-sidebar-item ${active ? "ui-sidebar-item--active" : ""} ${className}`.trim()}>{icon}<span className="ui-sidebar-item__label">{label}</span>{badge ? <span className="ui-sidebar-item__badge">{badge}</span> : null}</span>;
}

export function UserProfile({ initials, name, role, className = "" }: { initials: ReactNode; name: ReactNode; role: ReactNode; className?: string }) {
  return <div className={`ui-user-profile ${className}`.trim()}><span className="ui-user-profile__avatar">{initials}</span><div className="ui-user-profile__details"><strong>{name}</strong><span>{role}</span></div></div>;
}

export function PageHeader({ title, description, actions, className = "" }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return <header className={`ui-page-header ${className}`.trim()}><div><h1 className="ui-page-header__title">{title}</h1>{description ? <p className="ui-page-header__description">{description}</p> : null}</div>{actions ? <div className="ui-page-header__actions">{actions}</div> : null}</header>;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card ${className}`.trim()} {...props} />;
}

export function Table({ className = "", frameClassName = "", ...props }: TableHTMLAttributes<HTMLTableElement> & { frameClassName?: string }) {
  return <div className={`ui-table-frame ${frameClassName}`.trim()}><table className={`ui-table ${className}`.trim()} {...props} /></div>;
}

export function StatusBadge({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "info" | "danger" | "success" | "warning" | "neutral" }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`ui-button ui-button--${variant} ${className}`.trim()} {...props} />;
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button variant="secondary" {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`ui-input ${className}`.trim()} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`ui-select ${className}`.trim()} {...props} />;
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
