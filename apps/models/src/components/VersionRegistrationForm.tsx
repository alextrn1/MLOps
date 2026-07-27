import type { CreateModelVersionDto, ModelVersionStage } from "@mlops/contracts";
import { Button, Notice, SelectField, TextField } from "@mlops/ui";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { modelsApi } from "../api";
import { stageOptions } from "../modelViewModel";

const initialValues: CreateModelVersionDto = { version: "", stage: "staging", description: "", latencyP95Ms: null };

export function VersionRegistrationForm({ modelId, onCancel, onCreated }: { modelId: string; onCancel: () => void; onCreated: (message: string) => void }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ version?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault(); const next = { ...(values.version.trim() ? {} : { version: "Укажите номер версии." }), ...(values.description.trim() ? {} : { description: "Добавьте описание изменений." }) }; setErrors(next); if (Object.keys(next).length) return;
    setSubmitting(true); setSubmitError("");
    try { await modelsApi.createVersion(modelId, values); onCreated("Версия успешно зарегистрирована."); }
    catch { setSubmitError("Не удалось зарегистрировать версию. Попробуйте ещё раз."); setSubmitting(false); }
  };
  return <form className="version-register-form" onSubmit={submit} noValidate>
    <div className="version-register-form__title"><h3>Регистрация версии</h3><p>Добавьте идентификатор и краткое описание изменений.</p></div>
    {submitError ? <Notice tone="error">{submitError}</Notice> : null}
    <div className="version-register-grid">
      <TextField label="Версия *" value={values.version} onChange={(event: ChangeEvent<HTMLInputElement>) => { const value = event.currentTarget.value; setValues((current) => ({ ...current, version: value })); setErrors((current) => ({ ...current, version: undefined })); }} placeholder="Например, v2.3.0" error={errors.version} disabled={submitting} />
      <SelectField label="Стадия *" value={values.stage} onChange={(event) => { const value = event.currentTarget.value as ModelVersionStage; setValues((current) => ({ ...current, stage: value })); }} disabled={submitting}>{stageOptions.map((stage) => <option value={stage.value} key={stage.value}>{stage.label}</option>)}</SelectField>
      <TextField label="Задержка p95, ms" type="number" min="0" value={values.latencyP95Ms ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => { const value = event.currentTarget.value; setValues((current) => ({ ...current, latencyP95Ms: value ? Number(value) : null })); }} placeholder="Например, 45" disabled={submitting} />
      <TextField className="version-description-field" label="Описание *" value={values.description} onChange={(event: ChangeEvent<HTMLInputElement>) => { const value = event.currentTarget.value; setValues((current) => ({ ...current, description: value })); setErrors((current) => ({ ...current, description: undefined })); }} placeholder="Что изменилось в этой версии" error={errors.description} disabled={submitting} />
    </div>
    <div className="version-register-actions"><Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>Отмена</Button><Button type="submit" disabled={submitting}>{submitting ? <><span className="button-spinner" aria-hidden />Регистрация…</> : "Зарегистрировать"}</Button></div>
  </form>;
}
