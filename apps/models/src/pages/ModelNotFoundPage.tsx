import { AppIcon } from "@mlops/ui";
import { Link } from "react-router-dom";

export function ModelNotFoundPage({ kind }: { kind: "model" | "version" }) {
  const title = kind === "model" ? "Модель не найдена" : "Версия модели не найдена";
  const description = kind === "model" ? "Возможно, модель была удалена или ссылка указана неверно." : "Проверьте идентификаторы модели и версии.";
  return <section className="model-not-found" role="alert"><AppIcon name={kind === "model" ? "box" : "gitBranch"} size={30} aria-hidden /><h1>{title}</h1><p>{description}</p><Link className="ui-button ui-button--primary" to="/models"><AppIcon name="arrowLeft" size={17} aria-hidden />К реестру моделей</Link></section>;
}
