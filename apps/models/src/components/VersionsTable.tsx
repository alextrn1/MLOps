import type { ModelMetricDto, ModelVersionDto } from "@mlops/contracts";
import { AppIcon } from "@mlops/ui";
import { Link } from "react-router-dom";
import { formatDate } from "../modelViewModel";
import { ModelStageBadge } from "./ModelStageBadge";

export function VersionsTable({ modelId, versions, metrics }: { modelId: string; versions: ModelVersionDto[]; metrics: Record<string, ModelMetricDto[]> }) {
  if (!versions.length) return <p className="versions-empty">Нет зарегистрированных версий</p>;
  return <div className="versions-table-scroll"><table className="versions-table"><thead><tr><th>Версия</th><th>Стадия</th><th>Метрики качества</th><th>Задержка (p95)</th><th>Автор / Дата</th><th>Описание</th><th /></tr></thead><tbody>{versions.map((version) => <tr key={version.id}>
    <td data-label="Версия"><strong>{version.version}</strong></td>
    <td data-label="Стадия"><ModelStageBadge stage={version.stage} /></td>
    <td data-label="Метрики" className="metrics-cell">{metrics[version.id]?.length ? metrics[version.id].slice(0, 2).map((metric) => <span key={metric.key}>{metric.label === "Accuracy" ? "Acc" : metric.label}: {metric.formattedValue}</span>) : <span className="muted-value">Нет данных</span>}</td>
    <td data-label="Задержка">{version.latencyP95Ms === null ? "—" : `${version.latencyP95Ms}ms`}</td>
    <td data-label="Автор"><span className="version-author">{version.author}</span><span className="version-date"><AppIcon name="calendar" size={13} aria-hidden />{formatDate(version.createdAt)}</span></td>
    <td data-label="Описание"><span className="version-description">{version.description}</span></td>
    <td><Link className="version-details-link" to={`/models/${modelId}/versions/${version.id}`}>Детали</Link></td>
  </tr>)}</tbody></table></div>;
}
