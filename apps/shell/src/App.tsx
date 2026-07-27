import { AppIcon, type AppIconName } from "@mlops/ui";
import { lazy, type ComponentType, type FormEvent } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { RemoteBoundary } from "./RemoteBoundary";

const Dashboard = lazy(() => import("dashboard/routes"));
const Projects = lazy(() => import("projects/routes"));
const Models = lazy(() => import("models/routes"));
const Experiments = lazy(() => import("experiments/routes"));
const Datasets = lazy(() => import("datasets/routes"));
const Deployments = lazy(() => import("deployments/routes"));
const Monitoring = lazy(() => import("monitoring/routes"));

interface NavigationItem {
  to: string;
  label: string;
  icon: AppIconName;
  end?: boolean;
  badge?: string;
}

const navigation: readonly NavigationItem[] = [
  { to: "/", label: "Дашборд", icon: "layout", end: true },
  { to: "/projects", label: "Проекты", icon: "folder" },
  { to: "/models", label: "Модели", icon: "box" },
  { to: "/experiments", label: "Эксперименты", icon: "activity" },
  { to: "/datasets", label: "Датасеты", icon: "database" },
  { to: "/deployments", label: "Развёртывания", icon: "server" },
  { to: "/monitoring", label: "Мониторинг", icon: "bell", badge: "2" }
];

const profile = {
  initials: "AS",
  name: "Анна Смирнова",
  role: "Lead Data Scientist"
} as const;

function Remote({ name, component: RemoteComponent }: { name: string; component: ComponentType }) {
  return <RemoteBoundary name={name}><RemoteComponent /></RemoteBoundary>;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <AppIcon name="box" size={24} strokeWidth={2.1} aria-hidden />
        <span>MLOps Studio</span>
      </div>
      <div className="sidebar__body">
        <div className="sidebar__label">Платформа</div>
        <nav className="sidebar__nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}
            >
              <AppIcon name={item.icon} size={18} aria-hidden />
              <span className="nav-link__label">{item.label}</span>
              {item.badge ? <span className="nav-link__badge">{item.badge}</span> : null}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="profile">
        <span className="profile__avatar">{profile.initials}</span>
        <div className="profile__details"><strong>{profile.name}</strong><span>{profile.role}</span></div>
      </div>
    </aside>
  );
}

function Topbar() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <header className="topbar">
      <form className="global-search" role="search" onSubmit={handleSubmit}>
        <AppIcon name="search" size={18} aria-hidden />
        <input aria-label="Глобальный поиск" placeholder="Поиск по проектам, моделям, ID..." />
      </form>
      <button className="settings-button" type="button" aria-label="Настройки">
        <AppIcon name="settings" size={20} aria-hidden />
      </button>
    </header>
  );
}

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <Topbar />
        <div className="route-content">
          <Routes>
            <Route path="/" element={<Remote name="Дашборд" component={Dashboard} />} />
            <Route path="/projects/*" element={<Remote name="Проекты" component={Projects} />} />
            <Route path="/models/*" element={<Remote name="Модели" component={Models} />} />
            <Route path="/experiments/*" element={<Remote name="Эксперименты" component={Experiments} />} />
            <Route path="/datasets/*" element={<Remote name="Датасеты" component={Datasets} />} />
            <Route path="/deployments/*" element={<Remote name="Развёртывания" component={Deployments} />} />
            <Route path="/monitoring/*" element={<Remote name="Мониторинг" component={Monitoring} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
