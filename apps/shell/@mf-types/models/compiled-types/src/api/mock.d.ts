import type { CreateModelDto, CreateModelVersionDto, ModelArtifactDto, ModelDto, ModelMetricDto, ModelVersionDto, UpdateModelDto, UpdateModelVersionStageDto } from "@mlops/contracts";
export declare class MockModelApiError extends Error {
    readonly resource: "model" | "version";
    readonly status = 404;
    constructor(resource: "model" | "version");
}
export declare const mockModelsApi: {
    listModels(): Promise<ModelDto[]>;
    createModel(input: CreateModelDto): Promise<ModelDto>;
    getModel(modelId: string): Promise<ModelDto>;
    updateModel(modelId: string, input: UpdateModelDto): Promise<ModelDto>;
    listVersions(modelId: string): Promise<ModelVersionDto[]>;
    createVersion(modelId: string, input: CreateModelVersionDto): Promise<{
        id: string;
        version: string;
        stage: import("@mlops/contracts").ModelVersionStage;
        latencyP95Ms: number | null;
        author: string;
        createdAt: string;
        description: string;
        modelId: string;
    }>;
    getVersion(modelId: string, versionId: string): Promise<ModelVersionDto>;
    updateVersionStage(modelId: string, versionId: string, input: UpdateModelVersionStageDto): Promise<{
        id: string;
        modelId: string;
        version: string;
        latencyP95Ms: number | null;
        author: string;
        createdAt: string;
        description: string;
        stage: import("@mlops/contracts").ModelVersionStage;
    }>;
    getVersionMetrics(modelId: string, versionId: string): Promise<ModelMetricDto[]>;
    getVersionArtifacts(modelId: string, versionId: string): Promise<ModelArtifactDto[]>;
};
