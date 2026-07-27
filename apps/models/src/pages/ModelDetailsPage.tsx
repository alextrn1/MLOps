import type { ModelDto, ModelMetricDto, ModelVersionDto } from "@mlops/contracts";
import { AppIcon, ErrorState, LoadingState, Notice } from "@mlops/ui";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { isModelNotFound, modelsApi } from "../api";
import { VersionRegistrationForm } from "../components/VersionRegistrationForm";
import { VersionsTable } from "../components/VersionsTable";
import { ModelNotFoundPage } from "./ModelNotFoundPage";

export function ModelDetailsPage() {
  const { modelId = "" } = useParams(); const location = useLocation(); const routeSuccess = (location.state as { success?: string } | null)?.success;
  const [model, setModel] = useState<ModelDto | null>(null); const [versions, setVersions] = useState<ModelVersionDto[]>([]); const [metrics, setMetrics] = useState<Record<string, ModelMetricDto[]>>({});
  const [state, setState] = useState<"loading" | "ready" | "error" | "not-found">("loading"); const [reloadKey, setReloadKey] = useState(0); const [registering, setRegistering] = useState(false); const [success, setSuccess] = useState(routeSuccess ?? "");
  useEffect(() => { let active = true; setState("loading"); Promise.all([modelsApi.getModel(modelId), modelsApi.listVersions(modelId)]).then(async ([modelData, versionData]) => { const entries = await Promise.all(versionData.map(async (version) => [version.id, await modelsApi.getVersionMetrics(modelId, version.id)] as const)); if (active) { setModel(modelData); setVersions(versionData); setMetrics(Object.fromEntries(entries)); setState("ready"); } }).catch((error) => { if (active) setState(isModelNotFound(error) ? "not-found" : "error"); }); return () => { active = false; }; }, [modelId, reloadKey]);
  if (state === "loading") return <LoadingState label="Загружаем модель и версии…" />;
  if (state === "not-found") return <ModelNotFoundPage kind="model" />;
  if (state === "error") return <ErrorState title="Не удалось загрузить модель" description="Проверьте подключение к API и попробуйте снова." onRetry={() => setReloadKey((value) => value + 1)} />;
  if (!model) return null;
  return <section className="models-page model-details-page">{success ? <Notice>{success}</Notice> : null}<div className="model-detail-heading"><Link className="model-back" to="/models" aria-label="Вернуться к реестру"><AppIcon name="arrowLeft" size={20} aria-hidden /></Link><div className="model-detail-copy"><h1>{model.name}</h1><div className="model-meta"><span>Проект: <Link to={`/projects/${model.project.id}`}>{model.project.name}</Link></span><i>•</i><span><AppIcon name="tag" size={14} aria-hidden />{model.taskType}</span><i>•</i><span><AppIcon name="terminal" size={14} aria-hidden />{model.framework}</span></div></div><button className="ui-button ui-button--primary version-register-button" type="button" onClick={() => setRegistering((value) => !value)}>{registering ? "Закрыть форму" : "Зарегистрировать версию"}</button></div>
    {registering ? <VersionRegistrationForm modelId={model.id} onCancel={() => setRegistering(false)} onCreated={(message) => { setRegistering(false); setSuccess(message); setReloadKey((value) => value + 1); }} /> : null}
    <div className="version-history-card"><div className="version-history-title"><AppIcon name="gitBranch" size={22} aria-hidden /><h2>История версий</h2></div><VersionsTable modelId={model.id} versions={versions} metrics={metrics} /></div>
  </section>;
}
