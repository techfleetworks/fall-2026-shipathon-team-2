// Decorative QR-style pattern for the Show code screen (Figma P4). It is NOT a
// scannable QR code — staff use the 6-digit number printed beneath it. Swap for a
// real QR generator when staff scanning is built. Deterministic per `value`, so it
// renders identically on server and client.
const N = 21;

function isFinder(x: number, y: number) {
  const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7);
}

function finderOn(x: number, y: number) {
  const lx = x % (N - 7) === x ? x : x - (N - 7);
  const ly = y % (N - 7) === y ? y : y - (N - 7);
  const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
  const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
  return ring || core;
}

export function QrCode({ value, size = 176 }: { value: string; size?: number }) {
  let seed = 0;
  for (const ch of value) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };

  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const on = isFinder(x, y) ? finderOn(x, y) : rand() > 0.5;
      if (on) cells.push({ x, y });
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} aria-hidden="true" shapeRendering="crispEdges" className="text-text-primary">
      {cells.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}
