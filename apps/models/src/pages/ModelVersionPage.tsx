import type { ModelArtifactDto, ModelDto, ModelMetricDto, ModelVersionDto, ModelVersionStage } from "@mlops/contracts";
import { AppIcon, Button, DelayedLoadingState, ErrorState, invalidateCachedResources, Notice, SelectField, useCachedResource } from "@mlops/ui";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isModelNotFound, isVersionNotFound, modelsApi } from "../api";
import { ModelStageBadge } from "../components/ModelStageBadge";
import { formatBytes, formatDate, stageOptions } from "../modelViewModel";
import { ModelNotFoundPage } from "./ModelNotFoundPage";

export function ModelVersionPage() {
  const { modelId = "", versionId = "" } = useParams(); const [stage, setStage] = useState<ModelVersionStage | null>(null); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState(""); const [saveError, setSaveError] = useState("");
  const resource = useCachedResource<{ model: ModelDto; version: ModelVersionDto; metrics: ModelMetricDto[]; artifacts: ModelArtifactDto[] }>(`models:version:${modelId}:${versionId}`, async () => {
    const model = await modelsApi.getModel(modelId);
    const [version, metrics, artifacts] = await Promise.all([modelsApi.getVersion(modelId, versionId), modelsApi.getVersionMetrics(modelId, versionId), modelsApi.getVersionArtifacts(modelId, versionId)]);
    return { model, version, metrics, artifacts };
  }, [modelId, versionId]);
  if (resource.loading) return <DelayedLoadingState loading label="Загружаем версию модели…" />;
  if (resource.error && isModelNotFound(resource.error)) return <ModelNotFoundPage kind="model" />;
  if (resource.error && isVersionNotFound(resource.error)) return <ModelNotFoundPage kind="version" />;
  if (resource.error || !resource.data) return <ErrorState title="Не удалось загрузить версию" description="Проверьте подключение к API и попробуйте снова." onRetry={resource.retry} />;
  const { model, version, metrics, artifacts } = resource.data;
  const selectedStage = stage ?? version.stage;
  const saveStage = async () => { setSaving(true); setSaveError(""); try { const updated = await modelsApi.updateVersionStage(modelId, versionId, { stage: selectedStage }); invalidateCachedResources("models:list", `models:detail:${modelId}`, `models:version:${modelId}:${versionId}`); resource.setData({ model, version: updated, metrics, artifacts }); setStage(updated.stage); setNotice("Стадия версии обновлена."); } catch { setSaveError("Не удалось обновить стадию."); } finally { setSaving(false); } };
  return <section className="models-page model-version-page">{notice ? <Notice>{notice}</Notice> : null}{saveError ? <Notice tone="error">{saveError}</Notice> : null}<div className="model-version-heading"><Link className="model-back" to={`/models/${model.id}`} aria-label="К истории версий"><AppIcon name="arrowLeft" size={20} aria-hidden /></Link><div><span className="version-eyebrow">{model.name}</span><div className="version-title-line"><h1>{version.version}</h1><ModelStageBadge stage={version.stage} /></div><p>{version.description}</p></div></div>
    <div className="version-overview-grid"><div className="version-overview-card"><span><AppIcon name="gauge" size={21} aria-hidden /></span><small>Задержка (p95)</small><strong>{version.latencyP95Ms === null ? "Нет данных" : `${version.latencyP95Ms}ms`}</strong></div><div className="version-overview-card"><span><AppIcon name="calendar" size={21} aria-hidden /></span><small>Автор / Дата</small><strong>{version.author}</strong><em>{formatDate(version.createdAt)}</em></div><div className="version-stage-card"><SelectField label="Стадия версии" value={selectedStage} onChange={(event) => setStage(event.currentTarget.value as ModelVersionStage)} disabled={saving}>{stageOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</SelectField><Button type="button" onClick={saveStage} disabled={saving || selectedStage === version.stage}>{saving ? "Сохранение…" : "Сохранить стадию"}</Button></div></div>
    <div className="version-content-grid"><div className="version-data-card"><div className="version-data-card__title"><AppIcon name="gauge" size={20} aria-hidden /><h2>Метрики качества</h2><Link to="/experiments">Эксперименты</Link></div>{metrics.length ? <div className="metric-list">{metrics.map((metric) => <div key={metric.key}><span>{metric.label}</span><strong>{metric.formattedValue}</strong></div>)}</div> : <p className="version-data-empty">Метрики для этой версии не зарегистрированы</p>}</div><div className="version-data-card"><div className="version-data-card__title"><AppIcon name="file" size={20} aria-hidden /><h2>Артефакты</h2><Link to="/datasets">Данные</Link></div>{artifacts.length ? <div className="artifact-list">{artifacts.map((artifact) => <div key={artifact.id}><span className="artifact-icon"><AppIcon name="file" size={17} aria-hidden /></span><span><strong>{artifact.name}</strong><small>{artifact.type} • {formatBytes(artifact.sizeBytes)}</small></span></div>)}</div> : <p className="version-data-empty">Артефакты отсутствуют</p>}</div></div><div className="version-related-link"><Link to="/deployments">Перейти к развёртываниям</Link></div>
  </section>;
}
