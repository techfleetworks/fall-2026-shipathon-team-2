import type { SVGProps } from "react";

// Minimal icon set for the Sparetime happy path. Stroke-based, 24px, inherits
// currentColor. Matches the Figma "06 — Icon library" intent; exact glyph polish
// can come later. Decorative by default (aria-hidden); pass a `title` for meaning.

export type IconName =
  | "chevron-left"
  | "chevron-right"
  | "search"
  | "check"
  | "x"
  | "heart"
  | "heart-filled"
  | "bookmark"
  | "user"
  | "tag"
  | "calendar"
  | "clock"
  | "map-pin"
  | "info"
  | "alert"
  | "phone"
  | "ticket"
  | "sliders"
  | "scissors"
  | "shirt"
  | "lock"
  | "globe"
  | "accessibility"
  | "shield"
  | "star"
  | "star-filled";

const PATHS: Record<IconName, { d: string; fill?: boolean }[]> = {
  "chevron-left": [{ d: "M15 18l-6-6 6-6" }],
  "chevron-right": [{ d: "M9 18l6-6-6-6" }],
  search: [{ d: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" }, { d: "M21 21l-4.3-4.3" }],
  check: [{ d: "M20 6L9 17l-5-5" }],
  x: [{ d: "M18 6L6 18M6 6l12 12" }],
  heart: [{ d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7Z" }],
  "heart-filled": [{ d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7Z", fill: true }],
  bookmark: [{ d: "M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" }],
  user: [{ d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }, { d: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" }],
  tag: [{ d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" }, { d: "M7 7h.01" }],
  calendar: [{ d: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" }],
  clock: [{ d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" }, { d: "M12 6v6l4 2" }],
  "map-pin": [{ d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }, { d: "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }],
  info: [{ d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" }, { d: "M12 16v-4M12 8h.01" }],
  alert: [{ d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" }, { d: "M12 8v4M12 16h.01" }],
  phone: [{ d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" }],
  ticket: [{ d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" }, { d: "M13 5v14" }],
  sliders: [{ d: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" }],
  scissors: [{ d: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" }],
  shirt: [{ d: "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" }],
  lock: [{ d: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" }],
  globe: [{ d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" }, { d: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" }],
  accessibility: [{ d: "M12 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" }, { d: "M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5L8.5 21M12 14.5l3.5 6.5" }],
  shield: [{ d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }, { d: "M9 12l2 2 4-4" }],
  star: [{ d: "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z" }],
  "star-filled": [{ d: "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z", fill: true }],
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  title?: string;
}

export function Icon({ name, size = 24, title, ...props }: IconProps) {
  const paths = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill ? "currentColor" : "none"} stroke={p.fill ? "none" : "currentColor"} />
      ))}
    </svg>
  );
}
