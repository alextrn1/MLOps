import { useCachedResource } from "@mlops/ui";
import { datasetsApi } from "./api";

export interface DatasetFormOption {
  value: string;
  label: string;
}

export function useDatasetFormOptions() {
  const resource = useCachedResource(
    "datasets:form-options:projects",
    () => datasetsApi.listFormProjects(),
    []
  );

  return {
    projectOptions: (resource.data ?? []).map((project): DatasetFormOption => ({
      value: project.id,
      label: project.name
    })),
    loading: resource.loading,
    error: resource.error,
    retry: resource.retry
  };
}
