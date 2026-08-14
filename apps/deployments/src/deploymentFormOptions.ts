import { demoModelVersions, demoModels, demoProjects, type DeploymentEnvironment } from "@mlops/contracts";

export const deploymentEnvironmentOptions: ReadonlyArray<{ value: DeploymentEnvironment; label: string }> = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" }
];

export const deploymentProjectOptions = demoProjects.map((project) => ({ value: project.id, label: project.name }));

export const getDeploymentModelOptions = (projectId: string) => demoModels
  .filter((model) => model.projectId === projectId)
  .map((model) => ({ value: model.id, label: model.name }));

export const getDeploymentVersionOptions = (modelId: string) => demoModelVersions
  .filter((version) => version.modelId === modelId)
  .map((version) => ({ value: version.id, label: version.version }));
