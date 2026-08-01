import type { CreateDeploymentDto, DeploymentDto, DeploymentEventDto, DeploymentMetricsDto, UpdateDeploymentDto, UpdateDeploymentTrafficDto } from "@mlops/contracts";
export interface DeploymentsApi {
    listDeployments(): Promise<DeploymentDto[]>;
    createDeployment(input: CreateDeploymentDto): Promise<DeploymentDto>;
    getDeployment(deploymentId: string): Promise<DeploymentDto>;
    updateDeployment(deploymentId: string, input: UpdateDeploymentDto): Promise<DeploymentDto>;
    restartDeployment(deploymentId: string): Promise<DeploymentDto>;
    rollbackDeployment(deploymentId: string): Promise<DeploymentDto>;
    updateTraffic(deploymentId: string, input: UpdateDeploymentTrafficDto): Promise<DeploymentDto>;
    getMetrics(deploymentId: string): Promise<DeploymentMetricsDto>;
    getEvents(deploymentId: string): Promise<DeploymentEventDto[]>;
}
export declare const deploymentsApi: DeploymentsApi;
export declare const isDeploymentNotFound: (error: unknown) => boolean;
