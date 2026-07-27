import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExperimentsRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><main className="experiments-standalone"><Routes><Route path="/experiments/*" element={<ExperimentsRoutes />} /><Route path="*" element={<ExperimentsRoutes />} /></Routes></main></BrowserRouter></StrictMode>);
