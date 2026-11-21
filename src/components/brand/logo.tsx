// Sparetime app mark: the exact clock-wedge icon exported from Figma
// ("Logo: Sparetime", node 825:4061 → public/figma/app-icon.png).
// Used on Splash and Welcome.

export const BRAND_GRADIENT =
  "linear-gradient(160deg, #e9e2f5 0%, #f1eafb 34%, #f8e6ea 68%, #fdece5 100%)";

export function SparetimeLogo({ size = 72 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/figma/app-icon.png"
      alt="Sparetime"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
