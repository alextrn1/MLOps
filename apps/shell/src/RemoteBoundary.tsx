import { Component, Suspense, type ErrorInfo, type ReactNode } from "react";

interface Props { name: string; children: ReactNode; }
interface State { failed: boolean; }

export class RemoteBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Не удалось загрузить remote ${this.props.name}`, error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="remote-state" role="alert">
          <span className="remote-state__badge">Remote недоступен</span>
          <h1>Не удалось загрузить раздел «{this.props.name}»</h1>
          <p>Shell и остальные разделы продолжают работать.</p>
          <button type="button" onClick={() => window.location.reload()}>Повторить загрузку</button>
        </section>
      );
    }

    return <Suspense fallback={<section className="remote-state"><span className="spinner" aria-hidden="true"/><p>Загрузка раздела «{this.props.name}»…</p></section>}>{this.props.children}</Suspense>;
  }
}
