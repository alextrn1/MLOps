import type { CreateDatasetDto, CreateDatasetVersionDto, DatasetDto, DatasetLineageDto, DatasetProfileDto, DatasetSchemaFieldDto, DatasetVersionDto, UpdateDatasetDto } from "@mlops/contracts";
export interface DatasetsApi {
    listDatasets(): Promise<DatasetDto[]>;
    createDataset(input: CreateDatasetDto): Promise<DatasetDto>;
    getDataset(datasetId: string): Promise<DatasetDto>;
    updateDataset(datasetId: string, input: UpdateDatasetDto): Promise<DatasetDto>;
    listVersions(datasetId: string): Promise<DatasetVersionDto[]>;
    createVersion(datasetId: string, input: CreateDatasetVersionDto): Promise<DatasetVersionDto>;
    getVersion(datasetId: string, versionId: string): Promise<DatasetVersionDto>;
    getSchema(datasetId: string, versionId: string): Promise<DatasetSchemaFieldDto[]>;
    getProfile(datasetId: string, versionId: string): Promise<DatasetProfileDto>;
    getLineage(datasetId: string): Promise<DatasetLineageDto>;
}
export declare const datasetsApi: DatasetsApi;
export declare const isDatasetNotFound: (error: unknown) => boolean;
