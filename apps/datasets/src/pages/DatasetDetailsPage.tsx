import type { CreateDatasetVersionDto } from "@mlops/contracts";
import {
  AppIcon,
  Button,
  Card,
  DelayedLoadingState,
  EmptyState,
  ErrorState,
  invalidateCachedResources,
  Notice,
  TextField
} from "@mlops/ui";
import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { datasetsApi, isDatasetNotFound } from "../api";
import { formatDate, formatNumber } from "../format";
import { useApiResource } from "../useApiResource";
import { DatasetNotFoundPage } from "./DatasetNotFoundPage";

export function DatasetDetailsPage() {
  const { datasetId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showVersion, setShowVersion] = useState(false);
  const [version, setVersion] = useState<CreateDatasetVersionDto>({ version: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resource = useApiResource(
    () => Promise.all([
      datasetsApi.getDataset(datasetId),
      datasetsApi.listVersions(datasetId),
      datasetsApi.getLineage(datasetId)
    ]),
    [datasetId]
  );

  async function submitVersion(event: FormEvent) {
    event.preventDefault();

    if (!version.version.trim()) {
      setFormError("Укажите номер версии");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const created = await datasetsApi.createVersion(datasetId, version);
      invalidateCachedResources("datasets:[]", `datasets:${JSON.stringify([datasetId])}`);
      navigate(`/datasets/${datasetId}/versions/${created.id}`);
    } catch {
      setSubmitError("Не удалось зарегистрировать версию. Повторите попытку.");
    } finally {
      setSubmitting(false);
    }
  }

  if (resource.loading) {
    return (
      <section className="datasets-page">
        <DelayedLoadingState loading label="Загрузка карточки датасета…" />
      </section>
    );
  }

  if (resource.error && isDatasetNotFound(resource.error)) {
    return <DatasetNotFoundPage />;
  }

  if (resource.error || !resource.data) {
    return (
      <section className="datasets-page">
        <ErrorState
          title="Не удалось загрузить датасет"
          description="Повторите попытку."
          onRetry={resource.retry}
        />
      </section>
    );
  }

  const [dataset, versions, lineage] = resource.data;
  const successMessage = (location.state as { success?: string } | null)?.success;

  return (
    <section className="datasets-page">
      <button className="back-link" onClick={() => navigate("/datasets")} aria-label="Назад">
        <AppIcon name="arrowLeft" size={22} aria-hidden />
      </button>

      <header className="datasets-heading detail-heading">
        <div>
          <h1>
            {dataset.name} <span className="version-chip large">{dataset.latestVersion}</span>
          </h1>
          <p>{dataset.description}</p>
        </div>
        <Button onClick={() => setShowVersion((visible) => !visible)}>
          <AppIcon name="plus" size={18} aria-hidden />
          Зарегистрировать версию
        </Button>
      </header>

      {successMessage ? <Notice>{successMessage}</Notice> : null}

      <div className="dataset-summary">
        <Card>
          <AppIcon name="database" size={25} aria-hidden />
          <span>Источник<strong>{dataset.sourceLabel}</strong></span>
        </Card>
        <Card>
          <AppIcon name="folder" size={25} aria-hidden />
          <span>
            Проект
            <Link to={`/projects/${dataset.project.id}`}>{dataset.project.name}</Link>
          </span>
        </Card>
        <Card>
          <AppIcon name="file" size={25} aria-hidden />
          <span>Объем<strong>{formatNumber(dataset.sizeMb)} МБ</strong></span>
        </Card>
        <Card>
          <AppIcon name="columns" size={25} aria-hidden />
          <span>Строк<strong>{dataset.rowsLabel}</strong></span>
        </Card>
      </div>

      {showVersion ? (
        <form className="inline-version-form" onSubmit={submitVersion}>
          {submitError ? <Notice tone="error">{submitError}</Notice> : null}
          <TextField
            label="Номер версии"
            value={version.version}
            onChange={(event) => setVersion((current) => ({ ...current, version: event.target.value }))}
            error={formError}
            placeholder="2.2.0"
          />
          <TextField
            label="Описание"
            value={version.description}
            onChange={(event) => setVersion((current) => ({ ...current, description: event.target.value }))}
            placeholder="Что изменилось"
          />
          <Button disabled={submitting}>{submitting ? "Сохранение…" : "Создать версию"}</Button>
        </form>
      ) : null}

      <div className="detail-grid">
        <Card className="versions-card">
          <h2>
            <AppIcon name="gitBranch" size={22} aria-hidden />
            История версий
          </h2>
          {versions.length ? (
            <div className="versions-table">
              <div className="versions-head">
                <span>Версия</span>
                <span>Объем</span>
                <span>Строк</span>
                <span>Автор / Дата</span>
                <span />
              </div>
              {versions.map((versionItem) => (
                <div className="version-row" key={versionItem.id}>
                  <Link to={`/datasets/${dataset.id}/versions/${versionItem.id}`} className="mono">
                    {versionItem.version}
                  </Link>
                  <span>{formatNumber(versionItem.sizeMb)} МБ</span>
                  <span className="mono">{versionItem.rowsLabel}</span>
                  <span>
                    {versionItem.author}
                    <small>{formatDate(versionItem.createdAt)}</small>
                  </span>
                  <Link to={`/datasets/${dataset.id}/versions/${versionItem.id}`}>Детали</Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Нет зарегистрированных версий"
              description="Создайте первую версию набора данных."
            />
          )}
        </Card>

        <Card className="lineage-card">
          <h2>
            <AppIcon name="gitBranch" size={22} aria-hidden />
            Lineage
          </h2>
          <h3>Источник</h3>
          {lineage.upstream.map((node) => (
            <span className="lineage-node" key={node.id}>{node.name}</span>
          ))}
          <h3>Используется в</h3>
          {lineage.downstream.map((node) => (
            node.href ? (
              <Link className="lineage-node" to={node.href} key={node.id}>{node.name}</Link>
            ) : (
              <span className="lineage-node" key={node.id}>{node.name}</span>
            )
          ))}
        </Card>
      </div>
    </section>
  );
}
