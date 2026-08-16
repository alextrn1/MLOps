import { useCachedResource } from "@mlops/ui";
import { experimentsApi } from "./api";

export interface ExperimentFormOption {
  value: string;
  label: string;
}

export function useExperimentFormOptions(projectId: string) {
  const projects = useCachedResource(
    "experiments:form-options:projects",
    () => experimentsApi.listFormProjects(),
    []
  );
  const models = useCachedResource(
    "experiments:form-options:models",
    () => experimentsApi.listFormModels(),
    []
  );
  const datasets = useCachedResource(
    "experiments:form-options:datasets",
    () => experimentsApi.listFormDatasets(),
    []
  );

  return {
    projectOptions: (projects.data ?? []).map((project): ExperimentFormOption => ({
      value: project.id,
      label: project.name
    })),
    modelOptions: (models.data ?? [])
      .filter((model) => model.projectId === projectId)
      .map((model): ExperimentFormOption => ({ value: model.id, label: model.name })),
    datasetOptions: (datasets.data ?? [])
      .filter((dataset) => dataset.projectId === projectId)
      .map((dataset): ExperimentFormOption => ({
        value: dataset.id,
        label: `${dataset.name} · ${dataset.latestVersion}`
      })),
    loading: projects.loading || models.loading || datasets.loading,
    error: projects.error ?? models.error ?? datasets.error,
    retry: () => {
      projects.retry();
      models.retry();
      datasets.retry();
    }
  };
}
