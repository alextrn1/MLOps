import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MonitoringRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><Routes><Route path="/monitoring/*" element={<MonitoringRoutes />} /><Route path="/" element={<Navigate to="/monitoring" replace />} /><Route path="*" element={<Navigate to="/monitoring" replace />} /></Routes></BrowserRouter></StrictMode>);
