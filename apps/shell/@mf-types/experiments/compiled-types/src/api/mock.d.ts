import type { CreateExperimentDto, ExperimentArtifactDto, ExperimentDto, ExperimentLogLineDto, ExperimentMetricDto, ExperimentParameterDto } from "@mlops/contracts";
export declare class MockExperimentApiError extends Error {
    readonly status = 404;
    constructor();
}
export declare const mockExperimentsApi: {
    listExperiments(): Promise<ExperimentDto[]>;
    createExperiment(input: CreateExperimentDto): Promise<ExperimentDto>;
    getExperiment(id: string): Promise<ExperimentDto>;
    cancelExperiment(id: string): Promise<ExperimentDto>;
    retryExperiment(id: string): Promise<ExperimentDto>;
    getMetrics(id: string): Promise<ExperimentMetricDto[]>;
    getParameters(id: string): Promise<ExperimentParameterDto[]>;
    getArtifacts(id: string): Promise<ExperimentArtifactDto[]>;
    getLogs(id: string): Promise<ExperimentLogLineDto[]>;
};
