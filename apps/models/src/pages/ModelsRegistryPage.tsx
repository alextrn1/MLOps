import type { ModelDto, ModelFramework, ModelTaskType } from "@mlops/contracts";
import { AppIcon, EmptyState, ErrorState, LoadingState } from "@mlops/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { modelsApi } from "../api";
import { ModelsTable } from "../components/ModelsTable";
import { frameworkOptions, taskOptions } from "../modelViewModel";

export function ModelsRegistryPage() {
  const navigate = useNavigate(); const [models, setModels] = useState<ModelDto[]>([]); const [state, setState] = useState<"loading" | "ready" | "error">("loading"); const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState(""); const [filtersOpen, setFiltersOpen] = useState(false); const [task, setTask] = useState<ModelTaskType | "">(""); const [framework, setFramework] = useState<ModelFramework | "">("");
  useEffect(() => { let active = true; setState("loading"); modelsApi.listModels().then((data) => { if (active) { setModels(data); setState("ready"); } }).catch(() => { if (active) setState("error"); }); return () => { active = false; }; }, [reloadKey]);
  const visible = useMemo(() => { const normalized = query.trim().toLocaleLowerCase("ru-RU"); return models.filter((model) => (!normalized || `${model.name} ${model.description} ${model.project.name}`.toLocaleLowerCase("ru-RU").includes(normalized)) && (!task || model.taskType === task) && (!framework || model.framework === framework)); }, [models, query, task, framework]);
  return <section className="models-page models-registry-page"><div className="models-page-heading"><div><h1>Реестр моделей</h1><p>Централизованное хранилище всех ML-моделей платформы</p></div><button className="ui-button ui-button--primary register-model-button" type="button" onClick={() => navigate("/models/new")}><AppIcon name="plus" size={18} aria-hidden />Регистрация модели</button></div>
    {state === "loading" ? <LoadingState label="Загружаем реестр моделей…" /> : null}
    {state === "error" ? <ErrorState title="Не удалось загрузить модели" description="Проверьте подключение к API и попробуйте снова." onRetry={() => setReloadKey((value) => value + 1)} /> : null}
    {state === "ready" ? <><div className="models-toolbar"><div className="models-search"><AppIcon name="search" size={18} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию или описанию…" aria-label="Поиск моделей" /></div><button type="button" className={`ui-button ui-button--secondary filter-button ${filtersOpen ? "filter-button--active" : ""}`} onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}><AppIcon name="filter" size={18} aria-hidden />Фильтры</button></div>
      {filtersOpen ? <div className="models-filters"><label><span>Тип задачи</span><select value={task} onChange={(event) => setTask(event.target.value as ModelTaskType | "")}><option value="">Все типы</option>{taskOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label><span>Фреймворк</span><select value={framework} onChange={(event) => setFramework(event.target.value as ModelFramework | "")}><option value="">Все фреймворки</option>{frameworkOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><button type="button" className="models-filter-reset" onClick={() => { setTask(""); setFramework(""); }}>Сбросить</button></div> : null}
      {visible.length ? <ModelsTable models={visible} /> : <div className="models-empty-card"><EmptyState title={models.length ? "Модели не найдены" : "Моделей пока нет"} description={models.length ? "Измените запрос или параметры фильтрации." : "Зарегистрируйте первую модель, чтобы начать работу."} /></div>}
    </> : null}
  </section>;
}
