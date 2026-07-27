
    export type RemoteKeys = 'experiments/routes';
    type PackageType<T> = T extends 'experiments/routes' ? typeof import('experiments/routes') :any;