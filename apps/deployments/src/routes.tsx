import { useRoutes, type RouteObject } from "react-router-dom";
import { DeploymentDetailsPage } from "./pages/DeploymentDetailsPage";
import { DeploymentNotFoundPage } from "./pages/DeploymentNotFoundPage";
import { DeploymentsRegistryPage } from "./pages/DeploymentsRegistryPage";
import { NewDeploymentPage } from "./pages/NewDeploymentPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <DeploymentsRegistryPage /> },
  { path: "new", element: <NewDeploymentPage /> },
  { path: ":deploymentId", element: <DeploymentDetailsPage /> },
  { path: "*", element: <DeploymentNotFoundPage /> }
];
export default function DeploymentsRoutes() { return useRoutes(routes); }
