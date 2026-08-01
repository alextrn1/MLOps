import type { MonitoringApi } from "./index";
export declare class MockMonitoringApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export declare const mockMonitoringApi: MonitoringApi;
