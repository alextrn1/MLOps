import { createApiClient } from "@mlops/api-client";
import { getMockActivity, getMockIncidents, getMockSummary } from "./mock";
import type { DashboardActivityDto, DashboardApi, DashboardIncidentsDto, DashboardSummaryDto } from "./types";

export * from "./types";

function createRealDashboardApi(baseUrl: string): DashboardApi {
  const client = createApiClient({ baseUrl });
  return {
    getSummary: () => client.get<DashboardSummaryDto>("/dashboard/summary"),
    getActivity: () => client.get<DashboardActivityDto>("/dashboard/activity"),
    getIncidents: () => client.get<DashboardIncidentsDto>("/dashboard/incidents?status=open&limit=10")
  };
}

function createMockDashboardApi(): DashboardApi {
  return {
    getSummary: getMockSummary,
    getActivity: getMockActivity,
    getIncidents: getMockIncidents
  };
}

const apiMode = import.meta.env.VITE_API_MODE ?? "mock";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010";

if (apiMode !== "mock" && apiMode !== "real") {
  throw new Error(`Unsupported VITE_API_MODE: ${apiMode}`);
}

export const dashboardApi: DashboardApi = apiMode === "real" ? createRealDashboardApi(apiBaseUrl) : createMockDashboardApi();
