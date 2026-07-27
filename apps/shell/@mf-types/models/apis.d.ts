
    export type RemoteKeys = 'models/routes';
    type PackageType<T> = T extends 'models/routes' ? typeof import('models/routes') :any;