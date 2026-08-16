import { AppIcon, Button, DelayedLoadingState, ErrorState, invalidateCachedResources, Notice, SelectField, TextField } from "@mlops/ui";
import type { CreateDeploymentDto, DeploymentEnvironment } from "@mlops/contracts";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deploymentsApi } from "../api";
import { deploymentEnvironmentOptions, useDeploymentFormOptions } from "../deploymentFormOptions";

type FormModel = { name: string; environment: DeploymentEnvironment; url: string; projectId: string; modelId: string; modelVersionId: string; trafficPercent: string };
const initial: FormModel = { name: "", environment: "production", url: "", projectId: "", modelId: "", modelVersionId: "", trafficPercent: "100" };

export function NewDeploymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormModel, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const initialVersionSelected = useRef(false);
  const {
    projectOptions,
    modelOptions,
    versionOptions,
    loading: optionsLoading,
    error: optionsError,
    versionsLoading,
    versionsError,
    retry: retryOptions,
    retryVersions
  } = useDeploymentFormOptions(form.projectId, form.modelId);

  useEffect(() => {
    if (!form.projectId && projectOptions[0]) {
      setForm((current) => ({ ...current, projectId: projectOptions[0].value }));
    }
  }, [form.projectId, projectOptions]);

  useEffect(() => {
    if (form.projectId && !form.modelId && modelOptions[0]) {
      setForm((current) => ({ ...current, modelId: modelOptions[0].value }));
    }
  }, [form.modelId, form.projectId, modelOptions]);

  useEffect(() => {
    if (form.modelId && !form.modelVersionId && !versionsLoading && versionOptions[0]) {
      const nextVersion = initialVersionSelected.current
        ? versionOptions[0]
        : versionOptions.find((version) => version.label === "v2.1.0") ?? versionOptions[0];
      initialVersionSelected.current = true;
      setForm((current) => ({ ...current, modelVersionId: nextVersion.value }));
    }
  }, [form.modelId, form.modelVersionId, versionOptions, versionsLoading]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === "projectId") {
        return { ...current, projectId: value, modelId: "", modelVersionId: "" };
      }
      if (name === "modelId") return { ...current, modelId: value, modelVersionId: "" };
      return { ...current, [name]: value };
    });
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === "projectId" ? { modelId: undefined, modelVersionId: undefined } : name === "modelId" ? { modelVersionId: undefined } : {}) }));
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = "Укажите название endpoint";
    if (!/^https?:\/\//.test(form.url)) nextErrors.url = "Укажите полный HTTP(S) URL";
    if (!form.projectId) nextErrors.projectId = "Выберите проект";
    if (!form.modelId) nextErrors.modelId = "Выберите модель";
    if (!form.modelVersionId.trim()) nextErrors.modelVersionId = "Укажите версию модели";
    const traffic = Number(form.trafficPercent);
    if (!Number.isFinite(traffic) || traffic < 0 || traffic > 100) nextErrors.trafficPercent = "Допустимое значение — от 0 до 100";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setSubmitting(true); setApiError("");
    try {
      const payload: CreateDeploymentDto = { ...form, trafficPercent: traffic };
      const created = await deploymentsApi.createDeployment(payload);
      invalidateCachedResources("deployments:[]");
      navigate(`/deployments/${created.id}`, { replace: true });
    } catch { setApiError("Не удалось создать развёртывание. Повторите попытку."); }
    finally { setSubmitting(false); }
  };

  if (optionsLoading) return <section className="deployments-page deployment-form-page"><DelayedLoadingState loading label="Загрузка связанных ресурсов…" /></section>;
  if (optionsError) return <section className="deployments-page deployment-form-page"><ErrorState title="Не удалось загрузить связанные ресурсы" description="Проверьте API и повторите попытку." onRetry={retryOptions} /></section>;
  if (versionsError) return <section className="deployments-page deployment-form-page"><ErrorState title="Не удалось загрузить версии модели" description="Проверьте API и повторите попытку." onRetry={retryVersions} /></section>;

  return <section className="deployments-page deployment-form-page">
    <header className="deployment-form-header"><Link to="/deployments" aria-label="Назад"><AppIcon name="arrowLeft" size={23} aria-hidden /></Link><div><h1>Новый Deployment</h1><p>Развёртывание версии модели в production или staging</p></div></header>
    <form className="deployment-form" onSubmit={submit} noValidate>
      {apiError ? <Notice tone="error">{apiError}</Notice> : null}
      <div className="deployment-form-grid"><TextField label="Название endpoint" name="name" value={form.name} onChange={update} placeholder="Например, scoring" error={errors.name} /><SelectField label="Окружение" name="environment" value={form.environment} onChange={update}>{deploymentEnvironmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</SelectField><TextField className="deployment-form-wide" label="URL endpoint" name="url" value={form.url} onChange={update} placeholder="https://api.internal/ml/v1/scoring" error={errors.url} /><SelectField label="Проект" name="projectId" value={form.projectId} onChange={update} error={errors.projectId}>{projectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</SelectField><SelectField label="Модель" name="modelId" value={form.modelId} onChange={update} error={errors.modelId}><option value="">Выберите модель</option>{modelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</SelectField><SelectField label="Версия модели" name="modelVersionId" value={form.modelVersionId} onChange={update} error={errors.modelVersionId} disabled={submitting || versionsLoading || Boolean(versionsError)}><option value="">{versionsLoading ? "Загрузка версий…" : "Выберите версию"}</option>{versionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</SelectField><TextField label="Начальный трафик, %" name="trafficPercent" type="number" min="0" max="100" value={form.trafficPercent} onChange={update} error={errors.trafficPercent} /></div>
      <div className="deployment-form-actions"><Button type="button" variant="secondary" onClick={() => navigate("/deployments")} disabled={submitting}>Отмена</Button><Button type="submit" disabled={submitting}>{submitting ? "Создание…" : "Создать Deployment"}</Button></div>
    </form>
  </section>;
}
