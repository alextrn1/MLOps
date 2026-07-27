import{createApiClient}from"@mlops/api-client";export const datasetsApi=createApiClient({baseUrl:import.meta.env.VITE_API_BASE_URL??"http://localhost:4010/api/v1"});
