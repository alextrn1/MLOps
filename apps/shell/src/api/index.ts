import { createApiClient } from "@mlops/api-client";
import type { CurrentUserDto, GlobalSearchResultDto, UpdateUserSettingsDto, UserSettingsDto } from "@mlops/contracts";
import { mockShellApi } from "./mock";

export interface ShellApi {
  search(query: string): Promise<GlobalSearchResultDto[]>;
  getCurrentUser(): Promise<CurrentUserDto>;
  getSettings(): Promise<UserSettingsDto>;
  updateSettings(input: UpdateUserSettingsDto): Promise<UserSettingsDto>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010" });

const realShellApi: ShellApi = {
  search: (query) => http.get(`/api/v1/search?q=${encodeURIComponent(query)}`),
  getCurrentUser: () => http.get("/api/v1/me"),
  getSettings: () => http.get("/api/v1/settings"),
  updateSettings: (input) => http.patch("/api/v1/settings", input)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const shellApi: ShellApi = mode === "real" ? realShellApi : mockShellApi;
