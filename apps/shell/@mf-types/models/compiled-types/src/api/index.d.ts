import type { CreateModelDto, CreateModelVersionDto, ModelArtifactDto, ModelDto, ModelMetricDto, ModelVersionDto, UpdateModelDto, UpdateModelVersionStageDto } from "@mlops/contracts";
export interface ModelsApi {
    listModels(): Promise<ModelDto[]>;
    createModel(input: CreateModelDto): Promise<ModelDto>;
    getModel(modelId: string): Promise<ModelDto>;
    updateModel(modelId: string, input: UpdateModelDto): Promise<ModelDto>;
    listVersions(modelId: string): Promise<ModelVersionDto[]>;
    createVersion(modelId: string, input: CreateModelVersionDto): Promise<ModelVersionDto>;
    getVersion(modelId: string, versionId: string): Promise<ModelVersionDto>;
    updateVersionStage(modelId: string, versionId: string, input: UpdateModelVersionStageDto): Promise<ModelVersionDto>;
    getVersionMetrics(modelId: string, versionId: string): Promise<ModelMetricDto[]>;
    getVersionArtifacts(modelId: string, versionId: string): Promise<ModelArtifactDto[]>;
}
export declare const modelsApi: ModelsApi;
export declare const isModelNotFound: (error: unknown) => boolean;
export declare const isVersionNotFound: (error: unknown) => boolean;
