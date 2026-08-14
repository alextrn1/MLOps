import type { CreateDatasetDto, DatasetSourceType } from "@mlops/contracts";
import { AppIcon, Button, invalidateCachedResources, Notice, SelectField, TextField } from "@mlops/ui";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { datasetsApi } from "../api";

const initial: CreateDatasetDto = { name: "", description: "", projectId: "", sourceType: "dwh", sourceLabel: "" };

export function DatasetFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof CreateDatasetDto, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Укажите название";
    if (!form.description.trim()) next.description = "Добавьте описание";
    if (!form.projectId) next.projectId = "Выберите проект";
    if (!form.sourceLabel.trim()) next.sourceLabel = "Укажите источник";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true); setError("");
    try {
      const created = await datasetsApi.createDataset(form);
      invalidateCachedResources("datasets:[]");
      navigate(`/datasets/${created.id}`, { state: { success: "Датасет успешно зарегистрирован" } });
    } catch { setError("Не удалось зарегистрировать датасет. Повторите попытку."); }
    finally { setSubmitting(false); }
  }

  return <section className="datasets-page dataset-form-page">
    <header className="datasets-heading detail-heading"><button className="back-link" onClick={() => navigate("/datasets")} aria-label="Назад"><AppIcon name="arrowLeft" size={22} aria-hidden /></button><div><h1>Регистрация датасета</h1><p>Добавьте набор данных в реестр платформы</p></div></header>
    <form className="dataset-form" onSubmit={submit}>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <TextField label="Название" value={form.name} onChange={(event: ChangeEvent<HTMLInputElement>) => set("name", event.target.value)} error={errors.name} placeholder="Например, retail_credit_history_v3" />
      <TextField textarea label="Описание" value={form.description} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => set("description", event.target.value)} error={errors.description} placeholder="Кратко опишите содержимое набора данных" rows={4} />
      <div className="form-grid">
        <SelectField label="Проект" value={form.projectId} onChange={(event) => set("projectId", event.target.value)} error={errors.projectId}><option value="">Выберите проект</option><option value="p1">Кредитный Скоринг Retail</option><option value="p2">Рекомендации товаров e-commerce</option><option value="p3">Распознавание документов</option></SelectField>
        <SelectField label="Тип источника" value={form.sourceType} onChange={(event) => set("sourceType", event.target.value as DatasetSourceType)}><option value="dwh">DWH</option><option value="clickhouse">ClickHouse</option><option value="s3">S3</option></SelectField>
      </div>
      <TextField label="Источник" value={form.sourceLabel} onChange={(event: ChangeEvent<HTMLInputElement>) => set("sourceLabel", event.target.value)} error={errors.sourceLabel} placeholder="Например, DWH (Hadoop)" />
      <div className="form-actions"><Button type="button" variant="secondary" onClick={() => navigate("/datasets")} disabled={submitting}>Отмена</Button><Button type="submit" disabled={submitting}>{submitting ? "Регистрация…" : "Зарегистрировать"}</Button></div>
    </form>
  </section>;
}
