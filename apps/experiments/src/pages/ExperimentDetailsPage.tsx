import type {
  ExperimentArtifactDto,
  ExperimentDto,
  ExperimentLogLineDto,
  ExperimentMetricDto,
  ExperimentParameterDto
} from "@mlops/contracts";
import {
  AppIcon,
  Button,
  DelayedLoadingState,
  ErrorState,
  invalidateCachedResources,
  Notice,
  useCachedResource
} from "@mlops/ui";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { experimentsApi, isExperimentNotFound } from "../api";
import { ExperimentStatusBadge } from "../components/ExperimentStatusBadge";
import {
  MetricsPanel,
  ParametersPanel,
  ResourcesPanel,
  RuntimePanel,
  SupportingDataPanel
} from "../components/ExperimentPanels";
import { ExperimentNotFoundPage } from "./ExperimentNotFoundPage";

interface ExperimentDetailsData {
  experiment: ExperimentDto;
  metrics: ExperimentMetricDto[];
  parameters: ExperimentParameterDto[];
  artifacts: ExperimentArtifactDto[];
  logs: ExperimentLogLineDto[];
}

type ExperimentAction = "idle" | "cancelling" | "retrying";

export function ExperimentDetailsPage() {
  const { experimentId = "" } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState<ExperimentAction>("idle");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const resource = useCachedResource<ExperimentDetailsData>(
    `experiments:detail:${experimentId}`,
    async () => {
      const [experiment, metrics, parameters, artifacts, logs] = await Promise.all([
        experimentsApi.getExperiment(experimentId),
        experimentsApi.getMetrics(experimentId),
        experimentsApi.getParameters(experimentId),
        experimentsApi.getArtifacts(experimentId),
        experimentsApi.getLogs(experimentId)
      ]);

      return { experiment, metrics, parameters, artifacts, logs };
    },
    [experimentId]
  );

  if (resource.loading) {
    return (
      <section className="experiments-page">
        <DelayedLoadingState loading label="Загружаем данные прогона…" />
      </section>
    );
  }

  if (resource.error && isExperimentNotFound(resource.error)) {
    return <ExperimentNotFoundPage />;
  }

  if (resource.error || !resource.data) {
    return (
      <section className="experiments-page">
        <ErrorState
          title="Не удалось загрузить эксперимент"
          description="Проверьте подключение к API и попробуйте снова."
          onRetry={resource.retry}
        />
      </section>
    );
  }

  const { experiment, metrics, parameters, artifacts, logs } = resource.data;

  const cancelExperiment = async () => {
    setAction("cancelling");
    setActionError("");

    try {
      const updatedExperiment = await experimentsApi.cancelExperiment(experiment.id);
      invalidateCachedResources("experiments:list", `experiments:detail:${experiment.id}`);
      resource.setData({
        experiment: updatedExperiment,
        metrics,
        parameters,
        artifacts,
        logs
      });
      setActionMessage("Прогон отменён.");
    } catch {
      setActionError("Не удалось отменить прогон.");
    } finally {
      setAction("idle");
    }
  };

  const retryExperiment = async () => {
    setAction("retrying");
    setActionError("");

    try {
      const createdExperiment = await experimentsApi.retryExperiment(experiment.id);
      invalidateCachedResources("experiments:list");
      setActionMessage("Повторный прогон запущен.");
      navigate(`/experiments/${createdExperiment.id}`);
    } catch {
      setActionError("Не удалось повторить прогон.");
      setAction("idle");
    }
  };

  const canCancel = ["pending", "queued", "running"].includes(experiment.status);
  const canRetry = ["completed", "failed", "cancelled"].includes(experiment.status);

  return (
    <section className="experiments-page">
      <header className="experiment-detail-heading">
        <Link className="experiment-back" to="/experiments" aria-label="Назад к экспериментам">
          <AppIcon name="arrowLeft" size={22} aria-hidden />
        </Link>
        <div>
          <div className="experiment-title-line">
            <h1>{experiment.name}</h1>
            <ExperimentStatusBadge status={experiment.status} />
          </div>
          <p>
            ID: {experiment.id} <span>•</span> Проект:{" "}
            <Link to={`/projects/${experiment.project.id}`}>{experiment.project.name}</Link>
          </p>
        </div>
      </header>

      <div className="experiment-detail-grid">
        <MetricsPanel metrics={metrics} />
        <RuntimePanel experiment={experiment} />
        <ParametersPanel parameters={parameters} />
        <ResourcesPanel experiment={experiment} />
      </div>

      <SupportingDataPanel artifacts={artifacts} logs={logs} />

      <div className="experiment-actions-panel">
        {actionMessage ? <Notice>{actionMessage}</Notice> : null}
        {actionError ? <Notice tone="error">{actionError}</Notice> : null}
        <div>
          <Button
            variant="secondary"
            type="button"
            disabled={!canCancel || action !== "idle"}
            onClick={cancelExperiment}
          >
            {action === "cancelling" ? <span className="dark-button-spinner" aria-hidden /> : null}
            {action === "cancelling" ? "Отменяем…" : "Отменить прогон"}
          </Button>
          <Button
            type="button"
            disabled={!canRetry || action !== "idle"}
            onClick={retryExperiment}
          >
            {action === "retrying" ? (
              <span className="button-spinner" aria-hidden />
            ) : (
              <AppIcon name="play" size={16} aria-hidden />
            )}
            {action === "retrying" ? "Запускаем…" : "Повторить прогон"}
          </Button>
        </div>
      </div>
    </section>
  );
}
