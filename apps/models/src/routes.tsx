import { useRoutes, type RouteObject } from "react-router-dom";
import { ModelDetailsPage } from "./pages/ModelDetailsPage";
import { ModelFormPage } from "./pages/ModelFormPage";
import { ModelNotFoundPage } from "./pages/ModelNotFoundPage";
import { ModelsRegistryPage } from "./pages/ModelsRegistryPage";
import { ModelVersionPage } from "./pages/ModelVersionPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <ModelsRegistryPage /> },
  { path: "new", element: <ModelFormPage /> },
  { path: ":modelId/versions/:versionId", element: <ModelVersionPage /> },
  { path: ":modelId", element: <ModelDetailsPage /> },
  { path: "*", element: <ModelNotFoundPage kind="model" /> }
];
export default function ModelsRoutes() { return useRoutes(routes); }
