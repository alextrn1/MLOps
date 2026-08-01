import { useRoutes, type RouteObject } from "react-router-dom";
import { IncidentDetailsPage } from "./pages/IncidentDetailsPage";
import { IncidentNotFoundPage } from "./pages/IncidentNotFoundPage";
import { MonitoringRegistryPage } from "./pages/MonitoringRegistryPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <MonitoringRegistryPage /> },
  { path: ":incidentId", element: <IncidentDetailsPage /> },
  { path: "*", element: <IncidentNotFoundPage /> }
];
export default function MonitoringRoutes() { return useRoutes(routes); }
