import { demoProjects } from "@mlops/contracts";

export const datasetProjectOptions = demoProjects.map((project) => ({
  value: project.id,
  label: project.name
}));
