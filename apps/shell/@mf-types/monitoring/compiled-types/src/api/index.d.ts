import type { AlertRuleDto, CreateAlertRuleDto, CreateIncidentCommentDto, IncidentDto, IncidentTimelineEventDto, UpdateAlertRuleDto } from "@mlops/contracts";
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
export declare const monitoringApi: MonitoringApi;
export declare const isIncidentNotFound: (error: unknown) => boolean;
