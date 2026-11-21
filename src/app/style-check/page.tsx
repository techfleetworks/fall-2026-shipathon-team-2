import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design tokens check",
  description: "Visual check of the Sparetime design-system tokens (colors, type, radius, elevation).",
};

// Phase 0 verification page. Renders the design tokens via Tailwind utilities
// generated from globals.css @theme, so we can confirm color/type/radius/elevation
// match the Figma design system before building screens. Not a product route.

function Swatch({ name, cls, hex, dark }: { name: string; cls: string; hex: string; dark?: boolean }) {
  return (
    <div className="overflow-hidden rounded-md border border-border-default">
      <div className={`${cls} h-16 w-full`} />
      <div className="bg-surface-card px-3 py-2">
        <p className="text-label-md text-text-primary">{name}</p>
        <p className="text-body-sm text-text-secondary">{hex}</p>
      </div>
      {dark ? null : null}
    </div>
  );
}

const roles: [string, string, string][] = [
  ["action/primary", "bg-action-primary", "#63539c"],
  ["action/secondary", "bg-action-secondary", "#63597c"],
  ["on-tint/primary", "bg-on-tint-primary", "#4a3c82"],
  ["surface/default", "bg-surface-default", "#ffffff"],
  ["surface/subtle", "bg-surface-subtle", "#e8defe"],
  ["surface/muted", "bg-surface-muted", "#f0f0f0"],
  ["bg/canvas", "bg-bg-canvas", "#e8e8e8"],
  ["accent/primary", "bg-accent-primary", "#924750"],
  ["accent/surface", "bg-accent-surface", "#cfbcff"],
  ["panel/subtle", "bg-panel-subtle", "#fedadc"],
  ["danger/primary", "bg-danger-primary", "#b12a2f"],
  ["danger/surface", "bg-danger-surface", "#ffdad6"],
  ["status/positive", "bg-status-positive", "#2d694a"],
  ["status/positive-surface", "bg-status-positive-surface", "#b0f1cb"],
  ["border/default", "bg-border-default", "#c6c6c6"],
  ["text/primary", "bg-text-primary", "#1b1b1b"],
];

const categories: [string, string, string][] = [
  ["haircut", "bg-category-haircut-surface text-category-haircut", "#a8431a"],
  ["laundry", "bg-category-laundry-surface text-category-laundry", "#1d5c9e"],
  ["care", "bg-category-care-surface text-category-care", "#7a5800"],
];

const typeScale: [string, string][] = [
  ["Display · Bricolage 34/40", "text-display font-display"],
  ["Headline Large · 30/36", "text-headline-lg font-display"],
  ["Headline Small · 26/32", "text-headline-sm font-display"],
  ["Title Large · Jakarta 22/28", "text-title-lg"],
  ["Title Medium · 20/26", "text-title-md"],
  ["Title Small · 16/22", "text-title-sm"],
  ["Body Large · 15/22", "text-body-lg"],
  ["Body Medium · 14/20", "text-body-md"],
  ["Label Large · 15/20", "text-label-lg"],
  ["Label Small · 12/16", "text-label-sm"],
];

export default function StyleCheck() {
  return (
    <main className="mx-auto w-full max-w-[420px] bg-surface-default px-5 py-8">
      <p className="text-label-md text-action-primary">Phase 0 · token check</p>
      <h1 className="mt-1 text-display text-text-heading">Sparetime tokens</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Generated from the Figma variables. If these match the design system, the
        foundation is correct and we can start building screens.
      </p>

      <h2 className="mt-8 text-headline-sm text-text-heading">Color roles</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {roles.map(([name, cls, hex]) => (
          <Swatch key={name} name={name} cls={cls} hex={hex} />
        ))}
      </div>

      <h2 className="mt-8 text-headline-sm text-text-heading">Service categories</h2>
      <div className="mt-3 flex gap-2">
        {categories.map(([name, cls, hex]) => (
          <span key={name} className={`${cls} rounded-full px-3 py-1 text-label-md`}>
            {name} · {hex}
          </span>
        ))}
      </div>

      <h2 className="mt-8 text-headline-sm text-text-heading">Type scale</h2>
      <div className="mt-3 flex flex-col gap-3">
        {typeScale.map(([label, cls]) => (
          <div key={label}>
            <p className="text-body-sm text-text-secondary">{label}</p>
            <p className={`${cls} text-text-primary`}>Sparetime — within reach</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-headline-sm text-text-heading">Radius</h2>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        {["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"].map((r) => (
          <div key={r} className="text-center">
            <div className={`${r} h-16 w-16 bg-action-primary`} />
            <p className="mt-1 text-body-sm text-text-secondary">{r.replace("rounded-", "")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-headline-sm text-text-heading">Elevation</h2>
      <div className="mt-3 flex gap-4">
        {["shadow-e1", "shadow-e2", "shadow-e3"].map((s) => (
          <div key={s} className="text-center">
            <div className={`${s} h-16 w-16 rounded-md bg-surface-card`} />
            <p className="mt-1 text-body-sm text-text-secondary">{s.replace("shadow-", "")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-headline-sm text-text-heading">Buttons (preview)</h2>
      <div className="mt-3 flex flex-col gap-3">
        <button className="rounded-full bg-action-primary px-5 py-3 text-label-lg text-on-action">
          Book this slot
        </button>
        <button className="rounded-full bg-surface-subtle px-5 py-3 text-label-lg text-on-tint-primary">
          Browse offers
        </button>
        <button className="rounded-full bg-disabled-bg px-5 py-3 text-label-lg text-disabled-text" disabled>
          Continue
        </button>
      </div>
    </main>
  );
}
