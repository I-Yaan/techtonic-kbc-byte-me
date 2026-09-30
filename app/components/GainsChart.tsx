"use client";

import { formatEuro, type ChartSeries } from "@/lib/plans";

type GainsChartProps = {
  chart: ChartSeries;
  completedActions: number;
};

function toPath(
  values: number[],
  width: number,
  height: number,
  pad: number,
  max: number,
) {
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  return values
    .map((v, i) => {
      const x = pad + (i / Math.max(values.length - 1, 1)) * innerW;
      const y = pad + innerH - (v / max) * innerH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function toArea(
  values: number[],
  width: number,
  height: number,
  pad: number,
  max: number,
) {
  const line = toPath(values, width, height, pad, max);
  const innerW = width - pad * 2;
  const lastX = pad + innerW;
  const baseY = height - pad;
  return `${line} L ${lastX.toFixed(1)} ${baseY} L ${pad} ${baseY} Z`;
}

export default function GainsChart({ chart, completedActions }: GainsChartProps) {
  const width = 640;
  const height = 240;
  const pad = 28;
  const boost = 1 + completedActions * 0.06;
  const projected = chart.projected.map((v) => Math.round(v * boost));
  const last = projected[projected.length - 1] ?? 0;
  const lastBase = chart.baseline[chart.baseline.length - 1] ?? 0;
  const delta = Math.max(last - lastBase, 0);

  const max = Math.max(...projected, ...chart.baseline, 1);
  const projPath = toPath(projected, width, height, pad, max);
  const basePath = toPath(chart.baseline, width, height, pad, max);
  const projArea = toArea(projected, width, height, pad, max);

  return (
    <section className="tx-chart" aria-label="Projection des gains">
      <header className="tx-chart-head">
        <div>
          <p className="tx-kicker">Si tu suis le chemin</p>
          <h2>{formatEuro(last)}</h2>
          <p className="tx-chart-sub">{chart.metricLabel}</p>
        </div>
        <p className="tx-delta">
          + {formatEuro(delta)}
          <span> vs. ne rien changer</span>
        </p>
      </header>

      <svg
        className="tx-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${chart.metricLabel} sur ${chart.labels.join(", ")}`}
      >
        <defs>
          <linearGradient id="gainFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f7a4c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#1f7a4c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {chart.labels.map((label, i) => {
          const x =
            pad +
            (i / Math.max(chart.labels.length - 1, 1)) * (width - pad * 2);
          return (
            <g key={label}>
              <line
                x1={x}
                x2={x}
                y1={pad}
                y2={height - pad}
                className="tx-chart-grid"
              />
              <text x={x} y={height - 6} textAnchor="middle" className="tx-axis">
                {label}
              </text>
            </g>
          );
        })}
        <path d={projArea} fill="url(#gainFill)" />
        <path d={basePath} className="tx-line-base" />
        <path d={projPath} className="tx-line-proj" />
      </svg>

      <ul className="tx-legend">
        <li>
          <i className="tx-dot tx-dot-proj" />
          Avec le plan
        </li>
        <li>
          <i className="tx-dot tx-dot-base" />
          Sans changer d’habitudes
        </li>
      </ul>
    </section>
  );
}
