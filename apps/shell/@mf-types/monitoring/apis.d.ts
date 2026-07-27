
    export type RemoteKeys = 'monitoring/routes';
    type PackageType<T> = T extends 'monitoring/routes' ? typeof import('monitoring/routes') :any;