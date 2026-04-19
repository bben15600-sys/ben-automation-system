export default function Sparkline({
  data,
  color,
  width = 110,
  height = 36,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2] as const);

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path d={d} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={2.5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}
