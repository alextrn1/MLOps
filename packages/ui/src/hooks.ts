import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

const resourceCache = new Map<string, unknown>();

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

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    const cached = resourceCache.get(cacheKey) as T | undefined;
    if (cached === undefined) {
      setDataState(null);
      setLoading(true);
    } else {
      setDataState(cached);
      setLoading(false);
      setRefreshing(true);
    }
    setError(null);

    try {
      const value = await loader();
      resourceCache.set(cacheKey, value);
      if (requestId.current === currentRequest) setDataState(value);
    } catch (reason) {
      if (requestId.current === currentRequest && cached === undefined) setError(reason instanceof Error ? reason : new Error("Неизвестная ошибка API"));
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, ...deps]);

  useEffect(() => {
    void load();
    return () => { requestId.current += 1; };
  }, [load]);

  const setData = useCallback((value: T) => {
    resourceCache.set(cacheKey, value);
    setDataState(value);
  }, [cacheKey]);

  return { data, error, loading, refreshing, retry: load, setData };
}
