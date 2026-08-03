import type { ProjectDto, ProjectSummaryDto } from "@mlops/contracts";
import { AppIcon, DelayedLoadingState, ErrorState, Notice, useCachedResource } from "@mlops/ui";
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
  const resource = useCachedResource<[ProjectDto, ProjectSummaryDto]>(
    `projects:detail:${projectId}`,
    () => Promise.all([projectsApi.getProject(projectId), projectsApi.getProjectSummary(projectId)]),
    [projectId]
  );

  if (resource.loading) return <DelayedLoadingState loading label="Загружаем проект…" />;
  if (resource.error && isProjectNotFoundError(resource.error)) return <ProjectNotFoundPage />;
  if (resource.error || !resource.data) return <ErrorState title="Не удалось загрузить проект" description="Проверьте подключение к API и попробуйте снова." onRetry={resource.retry} />;
  const [project, summary] = resource.data;

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
