import type { IncidentStatus } from "@mlops/contracts";
export declare const statusLabel: (status: IncidentStatus) => "В работе" | "Открыт" | "Решён";
export declare const formatDetectedShort: (value: string) => string;
export declare const formatDateTime: (value: string) => string;
