import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DatasetsRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><Routes><Route path="/datasets/*" element={<DatasetsRoutes />} /><Route path="/" element={<Navigate to="/datasets" replace />} /><Route path="*" element={<Navigate to="/datasets" replace />} /></Routes></BrowserRouter></StrictMode>);
