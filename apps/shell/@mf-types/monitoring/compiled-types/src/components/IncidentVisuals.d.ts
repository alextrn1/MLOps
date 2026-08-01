import type { IncidentDto, IncidentStatus } from "@mlops/contracts";
export declare function IncidentStateIcon({ incident, size }: {
    incident: Pick<IncidentDto, "severity" | "status">;
    size?: number;
}): import("react").JSX.Element;
export declare function IncidentStatusBadge({ status }: {
    status: IncidentStatus;
}): import("react").JSX.Element;
