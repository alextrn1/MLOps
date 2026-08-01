import type { ProjectDto, ProjectSummaryDto } from "@mlops/contracts";
import { AppIcon, DelayedLoadingState, ErrorState, Notice } from "@mlops/ui";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { isProjectNotFoundError, projectsApi } from "../api";
import { ProjectRelations } from "../components/ProjectRelations";
import { ProjectStatusBadge } from "../components/ProjectStatusBadge";
import { ProjectSummaryCards } from "../components/ProjectSummaryCards";
import { ProjectNotFoundPage } from "./ProjectNotFoundPage";

export function ProjectDetailsPage() {
  const { projectId = "" } = useParams();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success;
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [summary, setSummary] = useState<ProjectSummaryDto | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "not-found">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true; setState("loading");
    Promise.all([projectsApi.getProject(projectId), projectsApi.getProjectSummary(projectId)])
      .then(([projectData, summaryData]) => { if (active) { setProject(projectData); setSummary(summaryData); setState("ready"); } })
      .catch((error) => { if (active) setState(isProjectNotFoundError(error) ? "not-found" : "error"); });
    return () => { active = false; };
  }, [projectId, reloadKey]);

  if (state === "loading") return <DelayedLoadingState loading label="Загружаем проект…" />;
  if (state === "not-found") return <ProjectNotFoundPage />;
  if (state === "error") return <ErrorState title="Не удалось загрузить проект" description="Проверьте подключение к API и попробуйте снова." onRetry={() => setReloadKey((value) => value + 1)} />;
  if (!project || !summary) return null;

  return <section className="projects-page project-details-page">
    {successMessage ? <Notice>{successMessage}</Notice> : null}
    <div className="project-detail-heading">
      <Link className="project-back" to="/projects" aria-label="Вернуться к проектам"><AppIcon name="arrowLeft" size={20} aria-hidden /></Link>
      <div className="project-detail-heading__copy"><div><h1>{project.name}</h1><ProjectStatusBadge status={project.status} detail /></div><p>{project.description}</p></div>
      <Link className="ui-button ui-button--secondary project-edit-button" to={`/projects/${project.id}/edit`}><AppIcon name="edit" size={17} aria-hidden />Редактировать</Link>
    </div>
    <ProjectSummaryCards projectId={project.id} summary={summary} />
    <ProjectRelations projectId={project.id} models={summary.models} deployments={summary.deployments} />
  </section>;
}
