import { AppIcon, Button, Notice, SelectField, TextField } from "@mlops/ui";
import type { CreateDeploymentDto, DeploymentEnvironment } from "@mlops/contracts";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deploymentsApi } from "../api";

type FormModel = { name: string; environment: DeploymentEnvironment; url: string; projectId: string; modelId: string; modelVersionId: string; trafficPercent: string };
const initial: FormModel = { name: "", environment: "production", url: "", projectId: "p1", modelId: "m1", modelVersionId: "v2.1.0", trafficPercent: "100" };

export function NewDeploymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormModel, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = "Укажите название endpoint";
    if (!/^https?:\/\//.test(form.url)) nextErrors.url = "Укажите полный HTTP(S) URL";
    if (!form.modelVersionId.trim()) nextErrors.modelVersionId = "Укажите версию модели";
    const traffic = Number(form.trafficPercent);
    if (!Number.isFinite(traffic) || traffic < 0 || traffic > 100) nextErrors.trafficPercent = "Допустимое значение — от 0 до 100";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setSubmitting(true); setApiError("");
    try {
      const payload: CreateDeploymentDto = { ...form, trafficPercent: traffic };
      const created = await deploymentsApi.createDeployment(payload);
      navigate(`/deployments/${created.id}`, { replace: true });
    } catch { setApiError("Не удалось создать развёртывание. Повторите попытку."); }
    finally { setSubmitting(false); }
  };

  return <section className="deployments-page deployment-form-page">
    <header className="deployment-form-header"><Link to="/deployments" aria-label="Назад"><AppIcon name="arrowLeft" size={23} aria-hidden /></Link><div><h1>Новый Deployment</h1><p>Развёртывание версии модели в production или staging</p></div></header>
    <form className="deployment-form" onSubmit={submit} noValidate>
      {apiError ? <Notice tone="error">{apiError}</Notice> : null}
      <div className="deployment-form-grid"><TextField label="Название endpoint" name="name" value={form.name} onChange={update} placeholder="Например, scoring" error={errors.name} /><SelectField label="Окружение" name="environment" value={form.environment} onChange={update}><option value="production">Production</option><option value="staging">Staging</option></SelectField><TextField className="deployment-form-wide" label="URL endpoint" name="url" value={form.url} onChange={update} placeholder="https://api.internal/ml/v1/scoring" error={errors.url} /><SelectField label="Проект" name="projectId" value={form.projectId} onChange={update}><option value="p1">Кредитный Скоринг Retail</option><option value="p2">Рекомендации товаров e-commerce</option><option value="p3">Распознавание документов</option></SelectField><SelectField label="Модель" name="modelId" value={form.modelId} onChange={update}><option value="m1">RetailScoring_XGB</option><option value="m2">TwoTower_RecSys</option><option value="m3">DocYOLO_Entities</option></SelectField><TextField label="Версия модели" name="modelVersionId" value={form.modelVersionId} onChange={update} error={errors.modelVersionId} /><TextField label="Начальный трафик, %" name="trafficPercent" type="number" min="0" max="100" value={form.trafficPercent} onChange={update} error={errors.trafficPercent} /></div>
      <div className="deployment-form-actions"><Button type="button" variant="secondary" onClick={() => navigate("/deployments")} disabled={submitting}>Отмена</Button><Button type="submit" disabled={submitting}>{submitting ? "Создание…" : "Создать Deployment"}</Button></div>
    </form>
  </section>;
}
