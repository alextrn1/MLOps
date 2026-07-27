import { AppIcon } from "@mlops/ui";
import { Link } from "react-router-dom";
export function ExperimentNotFoundPage() { return <section className="experiments-page experiment-not-found"><AppIcon name="alert" size={34} aria-hidden /><h1>Эксперимент не найден</h1><p>Проверьте идентификатор или вернитесь к списку прогонов.</p><Link className="ui-button ui-button--primary" to="/experiments">К экспериментам</Link></section>; }
