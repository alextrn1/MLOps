import "@mlops/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ModelsRoutes from "./routes";

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><main className="models-standalone"><Routes><Route path="/models/*" element={<ModelsRoutes />} /><Route path="*" element={<ModelsRoutes />} /></Routes></main></BrowserRouter></StrictMode>);
