import type { CreateExperimentDto, ExperimentArtifactDto, ExperimentDto, ExperimentLogLineDto, ExperimentMetricDto, ExperimentParameterDto } from "@mlops/contracts";
export interface ExperimentsApi {
    listExperiments(): Promise<ExperimentDto[]>;
    createExperiment(input: CreateExperimentDto): Promise<ExperimentDto>;
    getExperiment(experimentId: string): Promise<ExperimentDto>;
    cancelExperiment(experimentId: string): Promise<ExperimentDto>;
    retryExperiment(experimentId: string): Promise<ExperimentDto>;
    getMetrics(experimentId: string): Promise<ExperimentMetricDto[]>;
    getParameters(experimentId: string): Promise<ExperimentParameterDto[]>;
    getArtifacts(experimentId: string): Promise<ExperimentArtifactDto[]>;
    getLogs(experimentId: string): Promise<ExperimentLogLineDto[]>;
}
export declare const experimentsApi: ExperimentsApi;
export declare const isExperimentNotFound: (error: unknown) => boolean;
