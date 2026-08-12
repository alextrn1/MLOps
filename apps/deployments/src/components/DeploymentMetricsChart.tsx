import type { DeploymentMetricsDto } from "@mlops/contracts";
import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";

const desktopWidth = 860;

const monotonePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length < 2) return points[0] ? `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}` : "";
  const slopes = points.slice(1).map((point, index) => (point.y - points[index].y) / (point.x - points[index].x));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === points.length - 1) return slopes[slopes.length - 1];
    return slopes[index - 1] * slopes[index] <= 0 ? 0 : (slopes[index - 1] + slopes[index]) / 2;
  });

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const width = point.x - previous.x;
    return `${path} C${(previous.x + width / 3).toFixed(1)},${(previous.y + tangents[index] * width / 3).toFixed(1)} ${(point.x - width / 3).toFixed(1)},${(point.y - tangents[index + 1] * width / 3).toFixed(1)} ${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }, `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`);
};

export function DeploymentMetricsChart({ metrics }: { metrics: DeploymentMetricsDto }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(desktopWidth);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const compact = chartWidth < 560;
  const width = chartWidth;
  const height = compact ? 280 : 340;
  const plot = compact
    ? { left: 46, right: 42, top: 22, bottom: 55 }
    : { left: 68, right: 64, top: 28, bottom: 65 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;

  useLayoutEffect(() => {
    const chartWrap = chartWrapRef.current;
    if (!chartWrap) return;

    const updateWidth = (nextWidth: number) => {
      const roundedWidth = Math.max(240, Math.round(nextWidth));
      setChartWidth((currentWidth) => currentWidth === roundedWidth ? currentWidth : roundedWidth);
    };

    updateWidth(chartWrap.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => updateWidth(entry.contentRect.width));
    observer.observe(chartWrap);
    return () => observer.disconnect();
  }, []);

  const maxLatency = Math.max(160, Math.ceil(Math.max(...metrics.points.map((point) => point.latencyP95Ms)) / 40) * 40);
  const maxRequests = 8000;
  const x = (index: number) => plot.left + index / Math.max(1, metrics.points.length - 1) * plotWidth;
  const latencyY = (value: number) => plot.top + plotHeight - value / maxLatency * plotHeight;
  const requestsY = (value: number) => plot.top + plotHeight - value / maxRequests * plotHeight;
  const linePath = (key: "latencyP95Ms" | "requestsPerHour", scale: (value: number) => number) => monotonePath(metrics.points.map((point, index) => ({ x: x(index), y: scale(point[key]) })));
  const latencyPath = useMemo(() => linePath("latencyP95Ms", latencyY), [metrics, maxLatency, width]);
  const requestsPath = useMemo(() => linePath("requestsPerHour", requestsY), [metrics, width]);
  const activePoint = activeIndex === null ? null : metrics.points[activeIndex];
  const xTickStep = compact ? Math.max(1, Math.ceil((metrics.points.length - 1) / 4)) : 2;

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const svgX = (event.clientX - bounds.left) / bounds.width * width;
    const next = Math.round((svgX - plot.left) / plotWidth * (metrics.points.length - 1));
    setActiveIndex(Math.max(0, Math.min(metrics.points.length - 1, next)));
  };

  if (!metrics.points.length) return <div className="deployments-chart-empty">Нет данных метрик за выбранный период</div>;
  const activeX = activeIndex === null ? 0 : x(activeIndex);
  const tooltipWidth = Math.min(292, width - 16);
  const tooltipX = Math.min(width - tooltipWidth - 8, Math.max(8, activeX + 12));

  return (
    <div className="deployments-chart-wrap" ref={chartWrapRef}>
      <svg className="deployments-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="График latency и количества запросов за последние 24 часа" onPointerMove={handlePointerMove} onPointerLeave={() => setActiveIndex(null)}>
        {[0, .25, .5, .75, 1].map((fraction) => {
          const y = plot.top + plotHeight * (1 - fraction);
          return <g key={fraction}><line x1={plot.left} x2={width - plot.right} y1={y} y2={y} className="deployments-chart__grid" /><text x={plot.left - 10} y={y + 5} textAnchor="end">{Math.round(maxLatency * fraction)}ms</text><text x={width - plot.right + 10} y={y + 5}>{Math.round(maxRequests * fraction)}</text></g>;
        })}
        {metrics.points.map((point, index) => index % xTickStep === 0 || index === metrics.points.length - 1 ? <text key={point.timestamp} x={x(index)} y={height - 38} textAnchor="middle">{point.timeLabel}</text> : null)}
        <path d={requestsPath} className="deployments-chart__line deployments-chart__line--requests" />
        <path d={latencyPath} className="deployments-chart__line deployments-chart__line--latency" />
        {activePoint && activeIndex !== null ? <g className="deployments-chart__hover">
          <line x1={activeX} x2={activeX} y1={plot.top} y2={plot.top + plotHeight} />
          <circle cx={activeX} cy={latencyY(activePoint.latencyP95Ms)} r="5" className="deployments-chart__point deployments-chart__point--latency" />
          <circle cx={activeX} cy={requestsY(activePoint.requestsPerHour)} r="5" className="deployments-chart__point deployments-chart__point--requests" />
          <g transform={`translate(${tooltipX},${Math.max(74, latencyY(activePoint.latencyP95Ms) - 18)})`}>
            <rect width={tooltipWidth} height="116" rx="10" />
            <text x="16" y="31" className="deployments-chart__tooltip-time">{activePoint.timeLabel}</text>
            <text x="16" y="63" className="deployments-chart__tooltip-latency">Latency (p95): {activePoint.latencyP95Ms.toFixed(2)} ms</text>
            <text x="16" y="94" className="deployments-chart__tooltip-requests">Requests/hr: {activePoint.requestsPerHour}</text>
          </g>
        </g> : null}
      </svg>
    </div>
  );
}
