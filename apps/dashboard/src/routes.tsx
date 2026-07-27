import { useRoutes, type RouteObject } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";
import "./styles.css";

export const routes: RouteObject[] = [{ path: "*", element: <DashboardPage /> }];
export default function DashboardRoutes() { return useRoutes(routes); }
