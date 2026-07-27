import type { ProjectDto } from "@mlops/contracts";
import { AppIcon, EmptyState, ErrorState, LoadingState } from "@mlops/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api";
import { ProjectsTable } from "../components/ProjectsTable";

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true; setState("loading");
    projectsApi.listProjects().then((data) => { if (active) { setProjects(data); setState("ready"); } }).catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, [reloadKey]);

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    if (!normalized) return projects;
    return projects.filter((project) => `${project.name} ${project.description} ${project.owner.name}`.toLocaleLowerCase("ru-RU").includes(normalized));
  }, [projects, query]);

  return <section className="projects-page projects-list-page">
    <div className="projects-heading"><div><h1>Проекты</h1><p>Управление ML-инициативами и их ресурсами</p></div><button className="ui-button ui-button--primary new-project-button" type="button" onClick={() => navigate("/projects/new")}><AppIcon name="plus" size={18} aria-hidden />Новый проект</button></div>
    {state === "loading" ? <LoadingState label="Загружаем проекты…" /> : null}
    {state === "error" ? <ErrorState title="Не удалось загрузить проекты" description="Проверьте подключение к API и попробуйте снова." onRetry={() => setReloadKey((value) => value + 1)} /> : null}
    {state === "ready" ? <>
      <div className="projects-search"><div className="projects-search__control"><AppIcon name="search" size={18} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Поиск проектов" placeholder="Поиск проектов…" /></div></div>
      {visibleProjects.length ? <ProjectsTable projects={visibleProjects} /> : <div className="projects-empty-card"><EmptyState title={query ? "Проекты не найдены" : "Проектов пока нет"} description={query ? "Попробуйте изменить поисковый запрос." : "Создайте первый проект, чтобы начать работу."} /></div>}
    </> : null}
  </section>;
}
