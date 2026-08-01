import { Button } from "@mlops/ui";
import { useNavigate } from "react-router-dom";

export function DeploymentNotFoundPage() {
  const navigate = useNavigate();
  return <section className="deployments-page"><div className="deployment-not-found"><h1>Развёртывание не найдено</h1><p>Проверьте идентификатор или вернитесь к списку.</p><Button onClick={() => navigate("/deployments")}>К развёртываниям</Button></div></section>;
}
