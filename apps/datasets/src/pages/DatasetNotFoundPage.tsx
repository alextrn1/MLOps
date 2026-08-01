import { Button, EmptyState } from "@mlops/ui";
import { useNavigate } from "react-router-dom";
export function DatasetNotFoundPage({ version = false }: { version?: boolean }) { const navigate = useNavigate(); return <section className="datasets-page datasets-centered"><EmptyState title={version ? "Версия не найдена" : "Датасет не найден"} description="Проверьте адрес или вернитесь в реестр." /><Button onClick={() => navigate("/datasets")}>Вернуться к датасетам</Button></section>; }
