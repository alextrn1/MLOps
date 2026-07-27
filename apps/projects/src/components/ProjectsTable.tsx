import type { ProjectDto } from "@mlops/contracts";
import { Link } from "react-router-dom";
import { formatProjectDate } from "../projectViewModel";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectsTable({ projects }: { projects: ProjectDto[] }) {
  return (
    <div className="projects-table-card">
      <table className="projects-table">
        <thead><tr><th>Название</th><th>Владелец</th><th>Статус</th><th>Создан</th></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td data-label="Проект"><Link className="project-name" to={`/projects/${project.id}`}>{project.name}</Link><span className="project-description">{project.description}</span></td>
              <td data-label="Владелец">{project.owner.name} ({project.owner.title})</td>
              <td data-label="Статус"><ProjectStatusBadge status={project.status} /></td>
              <td data-label="Создан" className="project-date">{formatProjectDate(project.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
