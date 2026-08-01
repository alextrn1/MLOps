import { AppIcon, Button, DelayedLoadingState as LoadingState, EmptyState, ErrorState } from "@mlops/ui";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { datasetsApi } from "../api";
import { formatDate, formatNumber } from "../format";
import { useApiResource } from "../useApiResource";

export function DatasetsRegistryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const resource = useApiResource(() => datasetsApi.listDatasets(), []);
  const items = useMemo(() => (resource.data ?? []).filter((item) => `${item.name} ${item.description} ${item.project.name} ${item.sourceLabel}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [resource.data, query]);
  return <section className="datasets-page">
    <header className="datasets-heading"><div><h1>Датасеты</h1><p>Реестр наборов данных для обучения и мониторинга</p></div><Button onClick={() => navigate("/datasets/new")}><AppIcon name="plus" size={19} aria-hidden />Зарегистрировать датасет</Button></header>
    <div className="datasets-toolbar"><label className="datasets-search"><AppIcon name="search" size={20} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск датасетов..." aria-label="Поиск датасетов" /></label></div>
    {resource.loading ? <div className="datasets-panel"><LoadingState label="Загрузка датасетов…" /></div> : resource.error ? <div className="datasets-panel"><ErrorState title="Не удалось загрузить датасеты" description="Проверьте соединение и повторите попытку." onRetry={resource.retry} /></div> : items.length === 0 ? <div className="datasets-panel"><EmptyState title={query ? "Ничего не найдено" : "Нет зарегистрированных датасетов"} description={query ? "Измените поисковый запрос." : "Зарегистрируйте первый набор данных."} /></div> : <div className="datasets-table-wrap"><table className="datasets-table"><thead><tr><th>Название и Версия</th><th>Проект</th><th>Источник</th><th className="numeric">Объем (МБ)</th><th className="numeric">Строк</th><th>Создан</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="dataset-name"><AppIcon name="database" size={19} aria-hidden /><Link to={`/datasets/${item.id}`}>{item.name}</Link><span className="version-chip">{item.latestVersion}</span></div><p>{item.description}</p></td><td><a className="entity-link" href={`/projects/${item.project.id}`}>{item.project.name}</a></td><td>{item.sourceLabel}</td><td className="numeric mono">{formatNumber(item.sizeMb)}</td><td className="numeric mono">{item.rowsLabel}</td><td>{formatDate(item.createdAt)}</td></tr>)}</tbody></table></div>}
  </section>;
}
