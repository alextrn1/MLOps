import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectsRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><main className="projects-standalone"><Routes><Route path="/projects/*" element={<ProjectsRoutes />} /><Route path="*" element={<ProjectsRoutes />} /></Routes></main></BrowserRouter></StrictMode>);
