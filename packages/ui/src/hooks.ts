import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

const resourceCache = new Map<string, unknown>();
const resourceRequests = new Map<string, Promise<unknown>>();
const resourceGenerations = new Map<string, number>();

export function invalidateCachedResources(...cacheKeys: string[]): void {
  for (const cacheKey of cacheKeys) {
    resourceCache.delete(cacheKey);
    resourceRequests.delete(cacheKey);
    resourceGenerations.set(cacheKey, (resourceGenerations.get(cacheKey) ?? 0) + 1);
  }
}

export function useDelayedLoading(loading: boolean, delayMs = 200): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, loading]);

  return loading && visible;
}

export function useCachedResource<T>(cacheKey: string, loader: () => Promise<T>, deps: DependencyList) {
  const initial = resourceCache.get(cacheKey) as T | undefined;
  const [data, setDataState] = useState<T | null>(initial ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(initial === undefined);
  const [refreshing, setRefreshing] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(async (force = true) => {
    const currentRequest = ++requestId.current;
    const generation = resourceGenerations.get(cacheKey) ?? 0;
    const cached = resourceCache.get(cacheKey) as T | undefined;
    if (cached !== undefined && !force) {
      setDataState(cached);
      setLoading(false);
      setRefreshing(false);
      setError(null);
      return;
    }
    if (cached === undefined) {
      setDataState(null);
      setLoading(true);
    } else {
      setDataState(cached);
      setLoading(false);
      setRefreshing(true);
    }
    setError(null);

    let request = resourceRequests.get(cacheKey) as Promise<T> | undefined;
    try {
      if (!request || force) {
        request = loader();
        resourceRequests.set(cacheKey, request);
      }
      const value = await request;
      if ((resourceGenerations.get(cacheKey) ?? 0) === generation) {
        resourceCache.set(cacheKey, value);
        if (requestId.current === currentRequest) setDataState(value);
      }
    } catch (reason) {
      if (requestId.current === currentRequest && cached === undefined) setError(reason instanceof Error ? reason : new Error("Неизвестная ошибка API"));
    } finally {
      if (resourceRequests.get(cacheKey) === request) resourceRequests.delete(cacheKey);
      if (requestId.current === currentRequest) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, ...deps]);

  useEffect(() => {
    void load(false);
    return () => { requestId.current += 1; };
  }, [load]);

  const setData = useCallback((value: T) => {
    resourceCache.set(cacheKey, value);
    setDataState(value);
  }, [cacheKey]);

  const retry = useCallback(() => load(true), [load]);

  return { data, error, loading, refreshing, retry, setData };
}
