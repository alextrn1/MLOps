export declare function useApiResource<T>(loader: () => Promise<T>, deps: unknown[]): {
    data: T | null;
    error: Error | null;
    loading: boolean;
    refreshing: boolean;
    retry: () => Promise<void>;
    setData: (value: T) => void;
};
