import type { CurrentUserDto, GlobalSearchEntityType, GlobalSearchResultDto, UserSettingsDto } from "@mlops/contracts";
import { AppIcon, type AppIconName } from "@mlops/ui";
import { lazy, useEffect, useRef, useState, type ComponentType, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { shellApi } from "./api";
import { RemoteBoundary } from "./RemoteBoundary";

function memoizeImport<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => pending ??= load();
}

const loadDashboard = memoizeImport(() => import("dashboard/routes"));
const loadProjects = memoizeImport(() => import("projects/routes"));
const loadModels = memoizeImport(() => import("models/routes"));
const loadExperiments = memoizeImport(() => import("experiments/routes"));
const loadDatasets = memoizeImport(() => import("datasets/routes"));
const loadDeployments = memoizeImport(() => import("deployments/routes"));
const loadMonitoring = memoizeImport(() => import("monitoring/routes"));
const remoteLoaders = [loadDashboard, loadProjects, loadModels, loadExperiments, loadDatasets, loadDeployments, loadMonitoring] as const;

const Dashboard = lazy(loadDashboard);
const Projects = lazy(loadProjects);
const Models = lazy(loadModels);
const Experiments = lazy(loadExperiments);
const Datasets = lazy(loadDatasets);
const Deployments = lazy(loadDeployments);
const Monitoring = lazy(loadMonitoring);

interface NavigationItem {
  to: string;
  label: string;
  icon: AppIconName;
  end?: boolean;
  preload: () => Promise<unknown>;
}

const navigation: readonly NavigationItem[] = [
  { to: "/", label: "Дашборд", icon: "layout", end: true, preload: loadDashboard },
  { to: "/projects", label: "Проекты", icon: "folder", preload: loadProjects },
  { to: "/models", label: "Модели", icon: "box", preload: loadModels },
  { to: "/experiments", label: "Эксперименты", icon: "activity", preload: loadExperiments },
  { to: "/datasets", label: "Датасеты", icon: "database", preload: loadDatasets },
  { to: "/deployments", label: "Развёртывания", icon: "server", preload: loadDeployments },
  { to: "/monitoring", label: "Мониторинг", icon: "bell", preload: loadMonitoring }
];

function Remote({ name, component: RemoteComponent }: { name: string; component: ComponentType }) {
  return <RemoteBoundary name={name}><RemoteComponent /></RemoteBoundary>;
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return navigation.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      title={item.label}
      onClick={onNavigate}
      onMouseEnter={() => void item.preload()}
      onFocus={() => void item.preload()}
      className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}
    >
      <AppIcon name={item.icon} size={18} aria-hidden />
      <span className="nav-link__label">{item.label}</span>
    </NavLink>
  ));
}

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("ru-RU");
}

function UserIdentity({ user }: { user: CurrentUserDto | null }) {
  const name = user?.name ?? "Пользователь";
  return <><span className="profile__avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : getInitials(name)}</span><div className="profile__details"><strong>{name}</strong><span>{user?.role ?? "Загрузка…"}</span></div></>;
}

function UserBlock({ user }: { user: CurrentUserDto | null }) {
  return <div className="mobile-drawer__user"><div className="profile-surface"><UserIdentity user={user} /></div></div>;
}

function Sidebar({ user }: { user: CurrentUserDto | null }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const closeDrawer = () => {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  const keepFocusInside = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__identity"><AppIcon name="box" size={24} strokeWidth={2.1} aria-hidden /><span>MLOps Studio</span></div>
        <button ref={menuButtonRef} className="mobile-menu-button" type="button" aria-label="Открыть меню" aria-controls="mobile-navigation-drawer" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><span aria-hidden /><span aria-hidden /><span aria-hidden /></button>
      </div>
      <div className="sidebar__body">
        <div className="sidebar__label">Платформа</div>
        <nav className="sidebar__nav" aria-label="Основная навигация">
          <NavigationLinks />
        </nav>
      </div>
      <div className="profile">
        <div className="profile-surface">
          <UserIdentity user={user} />
        </div>
      </div>
      <button className={`mobile-drawer-overlay${drawerOpen ? " mobile-drawer-overlay--open" : ""}`} type="button" aria-label="Закрыть меню" tabIndex={drawerOpen ? 0 : -1} onClick={closeDrawer} />
      <div ref={drawerRef} id="mobile-navigation-drawer" className={`mobile-drawer${drawerOpen ? " mobile-drawer--open" : ""}`} role="dialog" aria-modal="true" aria-label="Навигация MLOps Studio" aria-hidden={!drawerOpen} onKeyDown={keepFocusInside}>
        <div className="mobile-drawer__header">
          <div className="brand__identity"><AppIcon name="box" size={24} strokeWidth={2.1} aria-hidden /><span>MLOps Studio</span></div>
          <button ref={closeButtonRef} className="mobile-drawer__close" type="button" aria-label="Закрыть меню" onClick={closeDrawer}><span aria-hidden /><span aria-hidden /></button>
        </div>
        <div className="mobile-drawer__body">
          <div className="mobile-drawer__label">Платформа</div>
          <nav className="mobile-drawer__nav" aria-label="Мобильная навигация"><NavigationLinks onNavigate={closeDrawer} /></nav>
        </div>
        <UserBlock user={user} />
      </div>
    </aside>
  );
}

function Topbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResultDto[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettingsDto | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) { setResults([]); setSearching(false); return; }
    let active = true;
    setSearching(true);
    const timeout = window.setTimeout(() => {
      shellApi.search(normalized).then((items) => {
        if (!active) return;
        setResults(items);
        setSearchOpen(true);
      }).catch(() => {
        if (active) setResults([]);
      }).finally(() => {
        if (active) setSearching(false);
      });
    }, 150);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [query]);

  useEffect(() => {
    if (!settingsOpen || settings || settingsLoading) return;
    setSettingsLoading(true); setSettingsError("");
    shellApi.getSettings().then(setSettings).catch(() => setSettingsError("Не удалось загрузить настройки.")).finally(() => setSettingsLoading(false));
  }, [settingsOpen]);

  const openResult = (result: GlobalSearchResultDto) => {
    navigate(result.route);
    setQuery(""); setResults([]); setSearchOpen(false);
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (results[0]) openResult(results[0]); };
  const entityLabels: Record<GlobalSearchEntityType, string> = { project: "Проект", model: "Модель", dataset: "Датасет", deployment: "Deployment", incident: "Инцидент" };
  const themeLabels: Record<UserSettingsDto["theme"], string> = { system: "Как в системе", light: "Светлая", dark: "Тёмная" };

  return (
    <header className="topbar">
      <form className="global-search" role="search" onSubmit={submitSearch}>
        <AppIcon name="search" size={18} aria-hidden />
        <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => { if (query.trim().length >= 2) setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }} aria-label="Глобальный поиск" placeholder="Поиск по проектам, моделям, ID..." autoComplete="off" />
        {searchOpen && query.trim().length >= 2 ? <div className="global-search__results">{searching ? <span className="global-search__state">Поиск…</span> : results.length ? results.map((result) => <button key={`${result.type}-${result.id}`} type="button" onClick={() => openResult(result)}><span>{result.title}</span><small>{entityLabels[result.type]} · {result.id}</small></button>) : <span className="global-search__state">Ничего не найдено</span>}</div> : null}
      </form>
      <div className="settings-control">
        <button className="settings-button" type="button" aria-label="Настройки" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((value) => !value)}><AppIcon name="settings" size={20} aria-hidden /></button>
        {settingsOpen ? <div className="settings-panel"><strong>Настройки платформы</strong>{settingsLoading ? <span>Загрузка…</span> : settingsError ? <span>{settingsError}</span> : settings ? <><dl><div><dt>Тема</dt><dd>{themeLabels[settings.theme]}</dd></div><div><dt>Язык</dt><dd>{settings.locale}</dd></div></dl><small>Расширенные настройки будут доступны после подключения backend.</small></> : null}</div> : null}
      </div>
    </header>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUserDto | null>(null);

  useEffect(() => {
    let active = true;
    shellApi.getCurrentUser().then((user) => { if (active) setCurrentUser(user); }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const preload = () => { for (const load of remoteLoaders) void load(); };
    const handle = idleWindow.requestIdleCallback?.(preload, { timeout: 2500 }) ?? window.setTimeout(preload, 1000);
    return () => {
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <div className="shell">
      <Sidebar user={currentUser} />
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
