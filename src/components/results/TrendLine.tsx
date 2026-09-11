export interface TrendPoint {
  label: string;
  band: number;
}

/* A single series, so no legend — the title names it. Only the last point is
   labelled; a number on every point is noise. */
export function TrendLine({
  points,
  target,
  min = 4,
  max = 9,
}: {
  points: TrendPoint[];
  target?: number;
  min?: number;
  max?: number;
}) {
  if (points.length < 2) {
    return (
      <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-text-muted">
        A trend needs at least two finished attempts. Take another test and this fills in.
      </p>
    );
  }

  const W = 560;
  const H = 200;
  const padL = 34;
  const padR = 46;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const x = (i: number) => padL + (i / (points.length - 1)) * plotW;
  const y = (b: number) => padT + (1 - (b - min) / (max - min)) * plotH;

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.band)}`).join(" ");
  const last = points[points.length - 1];
  const ticks = [];
  for (let b = min; b <= max; b += 1) ticks.push(b);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Band across ${points.length} attempts, ending at ${last.band.toFixed(1)}`}
      >
        {ticks.map((b) => (
          <g key={b}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(b)}
              y2={y(b)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={y(b) + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--text-subtle)"
            >
              {b}
            </text>
          </g>
        ))}

        {target !== undefined && (
          <line
            x1={padL}
            x2={W - padR}
            y1={y(target)}
            y2={y(target)}
            stroke="var(--accent-strong)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        )}

        <path d={path} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(p.band)}
            r={4.5}
            fill="var(--primary)"
            stroke="var(--bg-raised)"
            strokeWidth={2}
          >
            <title>{`${p.label}: band ${p.band.toFixed(1)}`}</title>
          </circle>
        ))}

        <text
          x={x(points.length - 1) + 10}
          y={y(last.band) + 4}
          fontSize={13}
          fontWeight={700}
          fill="var(--text)"
        >
          {last.band.toFixed(1)}
        </text>

        {points.map((p, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--text-subtle)"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {target !== undefined && (
        <figcaption className="mt-2 flex items-center gap-2 text-sm text-text-muted">
          <svg width="22" height="4" aria-hidden="true">
            <line x1="0" y1="2" x2="22" y2="2" stroke="var(--accent-strong)" strokeWidth="2" strokeDasharray="5 4" />
          </svg>
          Target {target.toFixed(1)}
        </figcaption>
      )}
    </figure>
  );
}
