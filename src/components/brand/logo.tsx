// Sparetime app mark: a clock with a coral "spare time" wedge, on a violet tile.
// Used on Splash and Welcome. Brand artwork (fixed colours, not tokens).

export const BRAND_GRADIENT =
  "linear-gradient(160deg, #e9e2f5 0%, #f1eafb 34%, #f8e6ea 68%, #fdece5 100%)";

export function SparetimeLogo({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Sparetime">
      <rect x="2" y="2" width="96" height="96" rx="28" fill="#63539c" />
      <circle cx="50" cy="52" r="26" fill="#ffffff" />
      <path d="M50 52 L50 26 A26 26 0 0 1 72.5 39 Z" fill="#e8949c" />
      <line x1="50" y1="52" x2="50" y2="34" stroke="#4a3c82" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="52" x2="63" y2="58" stroke="#4a3c82" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="52" r="3" fill="#4a3c82" />
    </svg>
  );
}
