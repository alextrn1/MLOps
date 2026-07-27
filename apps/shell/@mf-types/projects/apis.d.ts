
    export type RemoteKeys = 'projects/routes';
    type PackageType<T> = T extends 'projects/routes' ? typeof import('projects/routes') :any;