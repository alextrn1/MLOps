import { useCachedResource } from "@mlops/ui";

export function useApiResource<T>(loader: () => Promise<T>, deps: unknown[]) {
  return useCachedResource<T>(`deployments:${JSON.stringify(deps)}`, loader, deps);
}
