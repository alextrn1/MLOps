import { useRoutes, type RouteObject } from "react-router-dom";
import { ExperimentDetailsPage } from "./pages/ExperimentDetailsPage";
import { ExperimentNotFoundPage } from "./pages/ExperimentNotFoundPage";
import { ExperimentsListPage } from "./pages/ExperimentsListPage";
import { NewExperimentPage } from "./pages/NewExperimentPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <ExperimentsListPage /> },
  { path: "new", element: <NewExperimentPage /> },
  { path: ":experimentId", element: <ExperimentDetailsPage /> },
  { path: "*", element: <ExperimentNotFoundPage /> }
];
export default function ExperimentsRoutes() { return useRoutes(routes); }
