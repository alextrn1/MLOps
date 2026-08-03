import type { ModelDto, ModelMetricDto, ModelVersionDto } from "@mlops/contracts";
import { AppIcon, DelayedLoadingState, ErrorState, Notice, useCachedResource } from "@mlops/ui";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { isModelNotFound, modelsApi } from "../api";
import { VersionRegistrationForm } from "../components/VersionRegistrationForm";
import { VersionsTable } from "../components/VersionsTable";
import { ModelNotFoundPage } from "./ModelNotFoundPage";

export function ModelDetailsPage() {
  const { modelId = "" } = useParams(); const location = useLocation(); const routeSuccess = (location.state as { success?: string } | null)?.success;
  const [registering, setRegistering] = useState(false); const [success, setSuccess] = useState(routeSuccess ?? "");
  const resource = useCachedResource<{ model: ModelDto; versions: ModelVersionDto[]; metrics: Record<string, ModelMetricDto[]> }>(`models:detail:${modelId}`, async () => {
    const [model, versions] = await Promise.all([modelsApi.getModel(modelId), modelsApi.listVersions(modelId)]);
    const entries = await Promise.all(versions.map(async (version) => [version.id, await modelsApi.getVersionMetrics(modelId, version.id)] as const));
    return { model, versions, metrics: Object.fromEntries(entries) };
  }, [modelId]);
  if (resource.loading) return <DelayedLoadingState loading label="Загружаем модель и версии…" />;
  if (resource.error && isModelNotFound(resource.error)) return <ModelNotFoundPage kind="model" />;
  if (resource.error || !resource.data) return <ErrorState title="Не удалось загрузить модель" description="Проверьте подключение к API и попробуйте снова." onRetry={resource.retry} />;
  const { model, versions, metrics } = resource.data;
  return <section className="models-page model-details-page">{success ? <Notice>{success}</Notice> : null}<div className="model-detail-heading"><Link className="model-back" to="/models" aria-label="Вернуться к реестру"><AppIcon name="arrowLeft" size={20} aria-hidden /></Link><div className="model-detail-copy"><h1>{model.name}</h1><div className="model-meta"><span>Проект: <Link to={`/projects/${model.project.id}`}>{model.project.name}</Link></span><i>•</i><span><AppIcon name="tag" size={14} aria-hidden />{model.taskType}</span><i>•</i><span><AppIcon name="terminal" size={14} aria-hidden />{model.framework}</span></div></div><button className="ui-button ui-button--primary version-register-button" type="button" onClick={() => setRegistering((value) => !value)}>{registering ? "Закрыть форму" : "Зарегистрировать версию"}</button></div>
    {registering ? <VersionRegistrationForm modelId={model.id} onCancel={() => setRegistering(false)} onCreated={(message) => { setRegistering(false); setSuccess(message); void resource.retry(); }} /> : null}
    <div className="version-history-card"><div className="version-history-title"><AppIcon name="gitBranch" size={22} aria-hidden /><h2>История версий</h2></div><VersionsTable modelId={model.id} versions={versions} metrics={metrics} /></div>
  </section>;
}
