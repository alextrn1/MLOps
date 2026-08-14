import { waitForMockDelay } from "@mlops/api-client";
import {
  demoDatasets,
  demoDeployments,
  demoIncidents,
  demoModels,
  demoProjects,
  demoUsers,
  type CurrentUserDto,
  type GlobalSearchResultDto,
  type UpdateUserSettingsDto,
  type UserSettingsDto
} from "@mlops/contracts";
import type { ShellApi } from ".";

const wait = () => waitForMockDelay(import.meta.env.VITE_MOCK_DELAY_MS);
const clone = <T,>(value: T): T => structuredClone(value);

const searchEntries: readonly GlobalSearchResultDto[] = [
  ...demoProjects.map((project) => ({ type: "project" as const, id: project.id, title: project.name, route: `/projects/${project.id}` })),
  ...demoModels.map((model) => ({ type: "model" as const, id: model.id, title: model.name, route: `/models/${model.id}` })),
  ...demoDatasets.map((dataset) => ({ type: "dataset" as const, id: dataset.id, title: dataset.name, route: `/datasets/${dataset.id}` })),
  ...demoDeployments.map((deployment) => ({ type: "deployment" as const, id: deployment.id, title: deployment.name, route: `/deployments/${deployment.id}` })),
  ...demoIncidents.map((incident) => ({ type: "incident" as const, id: incident.id, title: incident.title, route: `/monitoring/${incident.id}` }))
];

const demoUser = demoUsers.find((user) => user.id === "u1") ?? demoUsers[0];
const currentUser: CurrentUserDto = {
  id: demoUser.id,
  name: demoUser.name,
  role: demoUser.title === "Lead DS" ? "Lead Data Scientist" : demoUser.title,
  avatarUrl: null
};

let settings: UserSettingsDto = { theme: "system", locale: "ru-RU" };

export const mockShellApi: ShellApi = {
  async search(query) {
    await wait();
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    if (!needle) return [];
    return clone(searchEntries.filter((entry) => `${entry.title} ${entry.id}`.toLocaleLowerCase("ru-RU").includes(needle)));
  },
  async getCurrentUser() { await wait(); return clone(currentUser); },
  async getSettings() { await wait(); return clone(settings); },
  async updateSettings(input: UpdateUserSettingsDto) { await wait(); settings = { ...settings, ...input }; return clone(settings); }
};
