import type { DeploymentsApi } from "./index";
export declare class MockDeploymentApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export declare const mockDeploymentsApi: DeploymentsApi;
