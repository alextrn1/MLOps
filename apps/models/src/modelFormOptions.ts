import { useCachedResource } from "@mlops/ui";
import { modelsApi } from "./api";

export interface ModelFormOption {
  value: string;
  label: string;
}

export function useModelFormOptions() {
  const resource = useCachedResource(
    "models:form-options:projects",
    () => modelsApi.listFormProjects(),
    []
  );

  return {
    projectOptions: (resource.data ?? []).map((project): ModelFormOption => ({
      value: project.id,
      label: project.name
    })),
    loading: resource.loading,
    error: resource.error,
    retry: resource.retry
  };
}
