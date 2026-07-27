import type { ModelDto } from "@mlops/contracts";
import { Link } from "react-router-dom";

export function ModelsTable({ models }: { models: ModelDto[] }) {
  return <div className="models-table-shell"><table className="models-table"><thead><tr><th>Название модели</th><th>Проект</th><th>Тип задачи</th><th>Фреймворк</th><th>Версий</th></tr></thead><tbody>{models.map((model) => <tr key={model.id}>
    <td data-label="Модель"><Link className="model-name-link" to={`/models/${model.id}`}>{model.name}</Link><span>{model.description}</span></td>
    <td data-label="Проект"><Link className="model-project-link" to={`/projects/${model.project.id}`}>{model.project.name}</Link></td>
    <td data-label="Тип задачи"><span className="task-badge">{model.taskType}</span></td>
    <td data-label="Фреймворк" className="framework-cell">{model.framework}</td>
    <td data-label="Версий">{model.versionsCount}</td>
  </tr>)}</tbody></table></div>;
}
