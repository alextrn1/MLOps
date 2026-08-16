import type { CreateExperimentDto } from "@mlops/contracts";
import {
  AppIcon,
  Button,
  DelayedLoadingState,
  ErrorState,
  invalidateCachedResources,
  Notice,
  SelectField,
  TextField
} from "@mlops/ui";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { experimentsApi } from "../api";
import { useExperimentFormOptions } from "../experimentFormOptions";

type FormErrors = Partial<Record<keyof CreateExperimentDto, string>>;

const initialForm: CreateExperimentDto = {
  name: "",
  projectId: "",
  modelId: "",
  datasetId: ""
};

export function NewExperimentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    projectOptions,
    modelOptions,
    datasetOptions,
    loading: optionsLoading,
    error: optionsError,
    retry: retryOptions
  } = useExperimentFormOptions(form.projectId);

  const updateField = (field: keyof CreateExperimentDto, value: string) => {
    setForm((current) => (
      field === "projectId"
        ? { ...current, projectId: value, modelId: "", datasetId: "" }
        : { ...current, [field]: value }
    ));
    setErrors((current) => (
      field === "projectId"
        ? { ...current, projectId: undefined, modelId: undefined, datasetId: undefined }
        : { ...current, [field]: undefined }
    ));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors: FormErrors = {};
    if (!form.name.trim()) validationErrors.name = "Введите название прогона";
    if (!form.projectId) validationErrors.projectId = "Выберите проект";
    if (!form.modelId) validationErrors.modelId = "Выберите модель";
    if (!form.datasetId) validationErrors.datasetId = "Выберите датасет";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const createdExperiment = await experimentsApi.createExperiment(form);
      invalidateCachedResources("experiments:list");
      setSuccess(true);
      navigate(`/experiments/${createdExperiment.id}`);
    } catch {
      setSubmitError("Не удалось запустить эксперимент. Попробуйте снова.");
      setSubmitting(false);
    }
  };

  if (optionsLoading) return <section className="experiments-page new-experiment-page"><DelayedLoadingState loading label="Загружаем связанные ресурсы…" /></section>;
  if (optionsError) return <section className="experiments-page new-experiment-page"><ErrorState title="Не удалось загрузить связанные ресурсы" description="Проверьте подключение к API и попробуйте снова." onRetry={retryOptions} /></section>;

  return (
    <section className="experiments-page new-experiment-page">
      <header className="new-experiment-heading">
        <Link className="experiment-back" to="/experiments" aria-label="Назад к экспериментам">
          <AppIcon name="arrowLeft" size={22} aria-hidden />
        </Link>
        <div>
          <h1>Запуск эксперимента</h1>
          <p>Создайте новый прогон обучения модели</p>
        </div>
      </header>

      <form className="new-experiment-card" onSubmit={submit} noValidate>
        <div className="new-experiment-card__header">
          <h2>Параметры прогона</h2>
          <p>Укажите связанные ресурсы и понятное имя эксперимента.</p>
        </div>

        <div className="new-experiment-fields">
          {submitError ? <Notice tone="error">{submitError}</Notice> : null}
          {success ? <Notice>Эксперимент запущен. Открываем карточку…</Notice> : null}
          <TextField
            label="Название прогона"
            placeholder="Например, xgb_features_tuning"
            value={form.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("name", event.target.value)}
            error={errors.name}
            disabled={submitting || success}
          />
          <SelectField
            label="Проект"
            value={form.projectId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("projectId", event.target.value)}
            error={errors.projectId}
            disabled={submitting || success}
          >
            <option value="">Выберите проект</option>
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>

          <div className="new-experiment-row">
            <SelectField
              label="Модель"
              value={form.modelId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("modelId", event.target.value)}
              error={errors.modelId}
              disabled={submitting || success || !form.projectId}
            >
              <option value="">Выберите модель</option>
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField
              label="Датасет"
              value={form.datasetId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("datasetId", event.target.value)}
              error={errors.datasetId}
              disabled={submitting || success || !form.projectId}
            >
              <option value="">Выберите датасет</option>
              {datasetOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="new-experiment-actions">
          <Button
            variant="secondary"
            type="button"
            disabled={submitting || success}
            onClick={() => navigate("/experiments")}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={submitting || success}>
            {submitting ? (
              <span className="button-spinner" aria-hidden />
            ) : (
              <AppIcon name="play" size={16} aria-hidden />
            )}
            {submitting ? "Запускаем…" : "Запустить прогон"}
          </Button>
        </div>
      </form>
    </section>
  );
}
