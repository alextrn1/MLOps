import { AppIcon } from "@mlops/ui";
import { Link } from "react-router-dom";

export function ProjectNotFoundPage() {
  return <section className="project-not-found" role="alert"><AppIcon name="folder" size={30} aria-hidden /><h1>Проект не найден</h1><p>Возможно, проект был удалён или ссылка указана неверно.</p><Link className="ui-button ui-button--primary" to="/projects"><AppIcon name="arrowLeft" size={17} aria-hidden />К списку проектов</Link></section>;
}
