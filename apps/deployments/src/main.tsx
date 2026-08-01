import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DeploymentsRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><Routes><Route path="/deployments/*" element={<DeploymentsRoutes />} /><Route path="/" element={<Navigate to="/deployments" replace />} /><Route path="*" element={<Navigate to="/deployments" replace />} /></Routes></BrowserRouter></StrictMode>);
