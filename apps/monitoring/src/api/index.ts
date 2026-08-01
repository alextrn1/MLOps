import { createApiClient } from "@mlops/api-client";
import type { AlertRuleDto, CreateAlertRuleDto, CreateIncidentCommentDto, IncidentDto, IncidentTimelineEventDto, UpdateAlertRuleDto } from "@mlops/contracts";
import { MockMonitoringApiError, mockMonitoringApi } from "./mock";

export interface MonitoringApi {
  listIncidents(): Promise<IncidentDto[]>;
  getIncident(incidentId: string): Promise<IncidentDto>;
  acknowledgeIncident(incidentId: string): Promise<IncidentDto>;
  resolveIncident(incidentId: string): Promise<IncidentDto>;
  reopenIncident(incidentId: string): Promise<IncidentDto>;
  getTimeline(incidentId: string): Promise<IncidentTimelineEventDto[]>;
  addComment(incidentId: string, input: CreateIncidentCommentDto): Promise<IncidentTimelineEventDto>;
  listAlertRules(): Promise<AlertRuleDto[]>;
  createAlertRule(input: CreateAlertRuleDto): Promise<AlertRuleDto>;
  updateAlertRule(ruleId: string, input: UpdateAlertRuleDto): Promise<AlertRuleDto>;
  deleteAlertRule(ruleId: string): Promise<void>;
}

const mode = import.meta.env.VITE_API_MODE ?? "mock";
const http = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000" });
const realMonitoringApi: MonitoringApi = {
  listIncidents: () => http.get("/api/v1/incidents"),
  getIncident: (id) => http.get(`/api/v1/incidents/${id}`),
  acknowledgeIncident: (id) => http.post(`/api/v1/incidents/${id}/acknowledge`, {}),
  resolveIncident: (id) => http.post(`/api/v1/incidents/${id}/resolve`, {}),
  reopenIncident: (id) => http.post(`/api/v1/incidents/${id}/reopen`, {}),
  getTimeline: (id) => http.get(`/api/v1/incidents/${id}/timeline`),
  addComment: (id, input) => http.post(`/api/v1/incidents/${id}/comments`, input),
  listAlertRules: () => http.get("/api/v1/alert-rules"),
  createAlertRule: (input) => http.post("/api/v1/alert-rules", input),
  updateAlertRule: (id, input) => http.patch(`/api/v1/alert-rules/${id}`, input),
  deleteAlertRule: (id) => http.delete(`/api/v1/alert-rules/${id}`)
};

if (mode !== "mock" && mode !== "real") throw new Error(`Unsupported VITE_API_MODE: ${mode}`);
export const monitoringApi: MonitoringApi = mode === "real" ? realMonitoringApi : mockMonitoringApi;
export const isIncidentNotFound = (error: unknown) => error instanceof MockMonitoringApiError || error instanceof Error && /404|incident not found/i.test(error.message);
