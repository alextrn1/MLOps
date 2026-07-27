
    export type RemoteKeys = 'deployments/routes';
    type PackageType<T> = T extends 'deployments/routes' ? typeof import('deployments/routes') :any;