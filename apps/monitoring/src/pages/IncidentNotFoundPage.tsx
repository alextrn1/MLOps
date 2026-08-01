import { Button } from "@mlops/ui";
import { useNavigate } from "react-router-dom";
export function IncidentNotFoundPage() { const navigate = useNavigate(); return <section className="monitoring-page"><div className="monitoring-not-found"><h1>Инцидент не найден</h1><p>Проверьте идентификатор или вернитесь к списку.</p><Button onClick={() => navigate("/monitoring")}>К мониторингу</Button></div></section>; }
