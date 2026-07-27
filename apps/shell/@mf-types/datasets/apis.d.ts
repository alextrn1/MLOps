
    export type RemoteKeys = 'datasets/routes';
    type PackageType<T> = T extends 'datasets/routes' ? typeof import('datasets/routes') :any;