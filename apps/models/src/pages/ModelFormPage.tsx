import type { CreateModelDto, ModelFramework, ModelTaskType } from "@mlops/contracts";
import {
  AppIcon,
  Button,
  invalidateCachedResources,
  Notice,
  SelectField,
  TextField
} from "@mlops/ui";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { modelsApi } from "../api";
import { modelProjectOptions } from "../modelFormOptions";
import { frameworkOptions, taskOptions } from "../modelViewModel";

const initialFormValues: CreateModelDto = {
  name: "",
  description: "",
  projectId: modelProjectOptions[0]?.value ?? "",
  taskType: "classification",
  framework: "xgboost"
};

export function ModelFormPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateModelDto, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = <K extends keyof CreateModelDto>(key: K, value: CreateModelDto[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = {
      ...(values.name.trim() ? {} : { name: "Укажите название модели." }),
      ...(values.description.trim() ? {} : { description: "Добавьте описание модели." }),
      ...(values.projectId ? {} : { projectId: "Выберите проект." })
    };

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const model = await modelsApi.createModel(values);
      invalidateCachedResources("models:list");
      navigate(`/models/${model.id}`, {
        replace: true,
        state: { success: "Модель успешно зарегистрирована." }
      });
    } catch {
      setSubmitError("Не удалось зарегистрировать модель. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  return (
    <section className="models-page model-form-page">
      <div className="model-form-heading">
        <Link className="model-back" to="/models" aria-label="Назад">
          <AppIcon name="arrowLeft" size={22} aria-hidden />
        </Link>
        <div>
          <h1>Регистрация модели</h1>
          <p>Добавьте модель в централизованный реестр платформы</p>
        </div>
      </div>

      <form className="model-form-card" onSubmit={submit} noValidate>
        <div className="model-form-fields">
          {submitError ? <Notice tone="error">{submitError}</Notice> : null}
          <TextField
            label="Название модели"
            value={values.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("name", event.currentTarget.value)}
            placeholder="Например, RetailScoring_XGB"
            error={errors.name}
            disabled={submitting}
          />
          <TextField
            label="Описание"
            textarea
            value={values.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField("description", event.currentTarget.value)}
            placeholder="Кратко опишите назначение модели"
            error={errors.description}
            disabled={submitting}
          />
          <SelectField
            label="Проект"
            value={values.projectId}
            onChange={(event) => updateField("projectId", event.currentTarget.value)}
            error={errors.projectId}
            disabled={submitting}
          >
            {modelProjectOptions.map((project) => (
              <option key={project.value} value={project.value}>{project.label}</option>
            ))}
          </SelectField>
          <div className="model-form-row">
            <SelectField
              label="Тип задачи"
              value={values.taskType}
              onChange={(event) => updateField("taskType", event.currentTarget.value as ModelTaskType)}
              disabled={submitting}
            >
              {taskOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField
              label="Фреймворк"
              value={values.framework}
              onChange={(event) => updateField("framework", event.currentTarget.value as ModelFramework)}
              disabled={submitting}
            >
              {frameworkOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="model-form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/models")}
            disabled={submitting}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="button-spinner" aria-hidden />
                Регистрация…
              </>
            ) : "Зарегистрировать модель"}
          </Button>
        </div>
      </form>
    </section>
  );
}
