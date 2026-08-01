import { useRoutes, type RouteObject } from "react-router-dom";
import { DatasetDetailsPage } from "./pages/DatasetDetailsPage";
import { DatasetFormPage } from "./pages/DatasetFormPage";
import { DatasetNotFoundPage } from "./pages/DatasetNotFoundPage";
import { DatasetsRegistryPage } from "./pages/DatasetsRegistryPage";
import { DatasetVersionPage } from "./pages/DatasetVersionPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <DatasetsRegistryPage /> },
  { path: "new", element: <DatasetFormPage /> },
  { path: ":datasetId/versions/:versionId", element: <DatasetVersionPage /> },
  { path: ":datasetId", element: <DatasetDetailsPage /> },
  { path: "*", element: <DatasetNotFoundPage /> }
];
export default function DatasetsRoutes() { return useRoutes(routes); }
