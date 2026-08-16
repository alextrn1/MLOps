import type { DeploymentEnvironment } from "@mlops/contracts";
import { useCachedResource } from "@mlops/ui";
import { deploymentsApi } from "./api";

export interface DeploymentFormOption {
  value: string;
  label: string;
}

export const deploymentEnvironmentOptions: ReadonlyArray<{ value: DeploymentEnvironment; label: string }> = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" }
];

export function useDeploymentFormOptions(projectId: string, modelId: string) {
  const projects = useCachedResource(
    "deployments:form-options:projects",
    () => deploymentsApi.listFormProjects(),
    []
  );
  const models = useCachedResource(
    "deployments:form-options:models",
    () => deploymentsApi.listFormModels(),
    []
  );
  const versions = useCachedResource(
    `deployments:form-options:versions:${modelId || "none"}`,
    () => modelId ? deploymentsApi.listFormModelVersions(modelId) : Promise.resolve([]),
    [modelId]
  );

  return {
    projectOptions: (projects.data ?? []).map((project): DeploymentFormOption => ({
      value: project.id,
      label: project.name
    })),
    modelOptions: (models.data ?? [])
      .filter((model) => model.projectId === projectId)
      .map((model): DeploymentFormOption => ({ value: model.id, label: model.name })),
    versionOptions: (versions.data ?? []).map((version): DeploymentFormOption => ({
      value: version.id,
      label: version.version
    })),
    loading: projects.loading || models.loading,
    error: projects.error ?? models.error,
    versionsLoading: Boolean(modelId && versions.loading),
    versionsError: versions.error,
    retry: () => {
      projects.retry();
      models.retry();
      if (modelId) versions.retry();
    },
    retryVersions: versions.retry
  };
}
