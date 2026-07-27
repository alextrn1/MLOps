
    export type RemoteKeys = 'dashboard/routes';
    type PackageType<T> = T extends 'dashboard/routes' ? typeof import('dashboard/routes') :any;