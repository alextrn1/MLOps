export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse>;
  put<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse>;
  delete<TResponse>(path: string): Promise<TResponse>;
}

export function getMockDelayMs(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function waitForMockDelay(value: string | undefined): Promise<void> {
  const delayMs = getMockDelayMs(value);
  if (delayMs === 0) return;
  await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
      const response = await fetchImpl(`${baseUrl}/${path.replace(/^\//, "")}`, {
        ...init,
        headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      if (response.status === 204) return undefined as TResponse;
      return response.json() as Promise<TResponse>;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
      request<TResponse>(path, { method: "POST", body: JSON.stringify(body) }),
    put: <TResponse, TBody = unknown>(path: string, body: TBody) =>
      request<TResponse>(path, { method: "PUT", body: JSON.stringify(body) }),
    patch: <TResponse, TBody = unknown>(path: string, body: TBody) =>
      request<TResponse>(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: <TResponse>(path: string) => request<TResponse>(path, { method: "DELETE" })
    }
}
