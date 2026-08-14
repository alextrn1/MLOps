import { demoProjects } from "@mlops/contracts";

export const modelProjectOptions = demoProjects.map((project) => ({
  value: project.id,
  label: project.name
}));
