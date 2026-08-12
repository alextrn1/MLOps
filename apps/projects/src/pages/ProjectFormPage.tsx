import type { CreateProjectDto, ProjectDto, ProjectOwnerDto, ProjectStatus } from "@mlops/contracts";
import { AppIcon, Button, DelayedLoadingState, ErrorState, Notice, SelectField, TextField } from "@mlops/ui";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isProjectNotFoundError, projectsApi } from "../api";
import { projectStatusOptions } from "../projectViewModel";
import { ProjectNotFoundPage } from "./ProjectNotFoundPage";

type FormErrors = Partial<Record<keyof CreateProjectDto, string>>;
const emptyForm: CreateProjectDto = { name: "", description: "", ownerId: "", status: "active" };

function validate(values: CreateProjectDto): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Укажите название проекта.";
  else if (values.name.trim().length < 3) errors.name = "Название должно содержать минимум 3 символа.";
  if (!values.description.trim()) errors.description = "Добавьте краткое описание проекта.";
  if (!values.ownerId) errors.ownerId = "Выберите владельца проекта.";
  if (!values.status) errors.status = "Выберите статус проекта.";
  return errors;
}

export function ProjectFormPage({ mode }: { mode: "create" | "edit" }) {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateProjectDto>(emptyForm);
  const [owners, setOwners] = useState<ProjectOwnerDto[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<"loading" | "ready" | "error" | "not-found">("loading");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [saved, setSaved] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true; setState("loading");
    const request = mode === "edit" ? Promise.all([projectsApi.listProjects(), projectsApi.getProject(projectId)]) : Promise.all([projectsApi.listProjects(), Promise.resolve<ProjectDto | null>(null)]);
    request.then(([projectList, project]) => {
      if (!active) return;
      const uniqueOwners = Array.from(new Map(projectList.map((item) => [item.owner.id, item.owner])).values());
      setOwners(uniqueOwners);
      setValues(project ? { name: project.name, description: project.description, ownerId: project.owner.id, status: project.status } : { ...emptyForm, ownerId: uniqueOwners[0]?.id ?? "" });
      setState("ready");
    }).catch((error) => { if (active) setState(isProjectNotFoundError(error) ? "not-found" : "error"); });
    return () => { active = false; };
  }, [mode, projectId, reloadKey]);

  const title = mode === "create" ? "Новый проект" : "Редактирование проекта";
  const subtitle = mode === "create" ? "Создайте пространство для ML-инициативы и её ресурсов" : "Измените основные параметры проекта";
  const cancelUrl = mode === "create" ? "/projects" : `/projects/${projectId}`;
  const ownerOptions = useMemo(() => owners.map((owner) => ({ value: owner.id, label: `${owner.name} (${owner.title})` })), [owners]);

  const update = <K extends keyof CreateProjectDto>(key: K, value: CreateProjectDto[K]) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values); setErrors(nextErrors); setSubmitError("");
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const savedProject = mode === "create" ? await projectsApi.createProject(values) : await projectsApi.updateProject(projectId, values);
      setSaved(true);
      navigate(`/projects/${savedProject.id}`, { replace: true, state: { success: mode === "create" ? "Проект успешно создан." : "Изменения успешно сохранены." } });
    } catch (error) {
      if (isProjectNotFoundError(error)) setState("not-found"); else setSubmitError("Не удалось сохранить проект. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  if (state === "loading") return <DelayedLoadingState loading label={mode === "create" ? "Подготавливаем форму…" : "Загружаем проект…"} />;
  if (state === "not-found") return <ProjectNotFoundPage />;
  if (state === "error") return <ErrorState title="Не удалось открыть форму" description="Проверьте подключение к API и попробуйте снова." onRetry={() => setReloadKey((value) => value + 1)} />;

  return <section className="projects-page project-form-page">
    <div className="form-page-heading"><button className="project-back" type="button" onClick={() => navigate(cancelUrl)} aria-label="Назад"><AppIcon name="arrowLeft" size={22} aria-hidden /></button><div><h1>{title}</h1><p>{subtitle}</p></div></div>
    <form className="project-form-card" onSubmit={handleSubmit} noValidate>
      <div className="project-form-card__header"><h2>Основная информация</h2><p>Поля со звёздочкой обязательны для заполнения.</p></div>
      <div className="project-form-grid">
        {saved ? <Notice>Проект сохранён. Выполняется переход…</Notice> : null}
        {submitError ? <Notice tone="error">{submitError}</Notice> : null}
        <TextField label="Название проекта *" value={values.name} onChange={(event: ChangeEvent<HTMLInputElement>) => update("name", event.currentTarget.value)} placeholder="Например, Кредитный Скоринг Retail" error={errors.name} disabled={submitting} />
        <TextField label="Описание *" textarea value={values.description} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => update("description", event.currentTarget.value)} placeholder="Кратко опишите цель проекта" error={errors.description} disabled={submitting} />
        <div className="project-form-row">
          <SelectField label="Владелец *" value={values.ownerId} onChange={(event) => update("ownerId", event.currentTarget.value)} error={errors.ownerId} disabled={submitting}>{ownerOptions.map((owner) => <option key={owner.value} value={owner.value}>{owner.label}</option>)}</SelectField>
          <SelectField label="Статус *" value={values.status} onChange={(event) => update("status", event.currentTarget.value as ProjectStatus)} error={errors.status} disabled={submitting}>{projectStatusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</SelectField>
        </div>
      </div>
      <div className="project-form-actions"><Button type="button" variant="secondary" onClick={() => navigate(cancelUrl)} disabled={submitting}>Отмена</Button><Button type="submit" disabled={submitting || saved}>{submitting ? <><span className="button-spinner" aria-hidden />Сохранение…</> : mode === "create" ? "Создать проект" : "Сохранить изменения"}</Button></div>
    </form>
  </section>;
}
