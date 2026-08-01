import type { ProjectDto } from "@mlops/contracts";
import { AppIcon, DelayedLoadingState, EmptyState, ErrorState, useCachedResource } from "@mlops/ui";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api";
import { ProjectsTable } from "../components/ProjectsTable";

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: projectData, error, loading, retry } = useCachedResource<ProjectDto[]>("projects:list", () => projectsApi.listProjects(), []);
  const projects = projectData ?? [];

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    if (!normalized) return projects;
    return projects.filter((project) => `${project.name} ${project.description} ${project.owner.name}`.toLocaleLowerCase("ru-RU").includes(normalized));
  }, [projects, query]);

  return <section className="projects-page projects-list-page">
    <div className="projects-heading"><div><h1>Проекты</h1><p>Управление ML-инициативами и их ресурсами</p></div><button className="ui-button ui-button--primary new-project-button" type="button" onClick={() => navigate("/projects/new")}><AppIcon name="plus" size={18} aria-hidden />Новый проект</button></div>
    <div className="projects-search"><div className="projects-search__control"><AppIcon name="search" size={18} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Поиск проектов" placeholder="Поиск проектов…" /></div></div>
    {error ? <ErrorState title="Не удалось загрузить проекты" description="Проверьте подключение к API и попробуйте снова." onRetry={retry} /> : null}
    {!error && projects.length === 0 ? <DelayedLoadingState loading={loading} label="Загружаем проекты…" /> : null}
    {(!error && !loading) || projects.length ? <>
      {visibleProjects.length ? <ProjectsTable projects={visibleProjects} /> : <div className="projects-empty-card"><EmptyState title={query ? "Проекты не найдены" : "Проектов пока нет"} description={query ? "Попробуйте изменить поисковый запрос." : "Создайте первый проект, чтобы начать работу."} /></div>}
    </> : null}
  </section>;
}
