import { demoDatasets, demoModels, demoProjects } from "@mlops/contracts";

export const experimentProjectOptions = demoProjects.map((project) => ({ value: project.id, label: project.name }));

export const getExperimentModelOptions = (projectId: string) => demoModels
  .filter((model) => model.projectId === projectId)
  .map((model) => ({ value: model.id, label: model.name }));

export const getExperimentDatasetOptions = (projectId: string) => demoDatasets
  .filter((dataset) => dataset.projectId === projectId)
  .map((dataset) => ({ value: dataset.id, label: `${dataset.name} · ${dataset.latestVersion}` }));
