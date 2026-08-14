import {
  AppIcon,
  Card,
  DelayedLoadingState,
  EmptyState,
  ErrorState,
  StatusBadge
} from "@mlops/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { datasetsApi, isDatasetNotFound } from "../api";
import { formatDate, formatNumber } from "../format";
import { useApiResource } from "../useApiResource";
import { DatasetNotFoundPage } from "./DatasetNotFoundPage";

export function DatasetVersionPage() {
  const { datasetId = "", versionId = "" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"schema" | "profile">("schema");
  const resource = useApiResource(
    () => Promise.all([
      datasetsApi.getDataset(datasetId),
      datasetsApi.getVersion(datasetId, versionId),
      datasetsApi.getSchema(datasetId, versionId),
      datasetsApi.getProfile(datasetId, versionId)
    ]),
    [datasetId, versionId]
  );

  if (resource.loading) {
    return (
      <section className="datasets-page">
        <DelayedLoadingState loading label="Загрузка версии…" />
      </section>
    );
  }

  if (resource.error && isDatasetNotFound(resource.error)) {
    return <DatasetNotFoundPage version />;
  }

  if (resource.error || !resource.data) {
    return (
      <section className="datasets-page">
        <ErrorState
          title="Не удалось загрузить версию"
          description="Повторите попытку."
          onRetry={resource.retry}
        />
      </section>
    );
  }

  const [dataset, version, schema, profile] = resource.data;

  return (
    <section className="datasets-page">
      <button
        className="back-link"
        onClick={() => navigate(`/datasets/${datasetId}`)}
        aria-label="Назад"
      >
        <AppIcon name="arrowLeft" size={22} aria-hidden />
      </button>

      <header className="datasets-heading detail-heading">
        <div>
          <h1>
            {dataset.name} <StatusBadge tone="primary">{version.version}</StatusBadge>
          </h1>
          <p>{version.description}</p>
        </div>
      </header>

      <div className="version-meta">
        <span>Автор<strong>{version.author}</strong></span>
        <span>Создан<strong>{formatDate(version.createdAt)}</strong></span>
        <span>Объем<strong>{formatNumber(version.sizeMb)} МБ</strong></span>
        <span>Строк<strong>{version.rowsLabel}</strong></span>
      </div>

      <Card className="version-content">
        <div className="dataset-tabs" role="tablist">
          <button
            className={tab === "schema" ? "active" : ""}
            onClick={() => setTab("schema")}
            role="tab"
            aria-selected={tab === "schema"}
          >
            Схема данных
          </button>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
            role="tab"
            aria-selected={tab === "profile"}
          >
            Профиль
          </button>
        </div>

        {tab === "schema" ? (
          schema.length ? (
            <div className="schema-table">
              <div>
                <b>Поле</b>
                <b>Тип</b>
                <b>Nullable</b>
                <b>Описание</b>
              </div>
              {schema.map((field) => (
                <div key={field.name}>
                  <code>{field.name}</code>
                  <code>{field.type}</code>
                  <span>{field.nullable ? "Да" : "Нет"}</span>
                  <span>{field.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Схема отсутствует"
              description="Для этой версии нет описания полей."
            />
          )
        ) : (
          <div className="profile-grid">
            <div><span>Строк</span><strong>{formatNumber(profile.rowsCount)}</strong></div>
            <div><span>Колонок</span><strong>{profile.columnsCount}</strong></div>
            <div><span>Пропуски</span><strong>{profile.missingValuesPercent}%</strong></div>
            <div><span>Дубликаты</span><strong>{profile.duplicateRowsPercent}%</strong></div>
          </div>
        )}
      </Card>
    </section>
  );
}
