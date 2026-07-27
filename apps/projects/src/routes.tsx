import { useRoutes, type RouteObject } from "react-router-dom";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { ProjectFormPage } from "./pages/ProjectFormPage";
import { ProjectNotFoundPage } from "./pages/ProjectNotFoundPage";
import { ProjectsListPage } from "./pages/ProjectsListPage";
import "./styles.css";

export const routes: RouteObject[] = [
  { index: true, element: <ProjectsListPage /> },
  { path: "new", element: <ProjectFormPage mode="create" /> },
  { path: ":projectId/edit", element: <ProjectFormPage mode="edit" /> },
  { path: ":projectId", element: <ProjectDetailsPage /> },
  { path: "*", element: <ProjectNotFoundPage /> }
];

export default function ProjectsRoutes() { return useRoutes(routes); }
