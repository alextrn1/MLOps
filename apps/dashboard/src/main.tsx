import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import DashboardRoutes from "./routes";
import "@mlops/ui/tokens.css";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><main className="dashboard-standalone"><DashboardRoutes /></main></BrowserRouter></StrictMode>);
