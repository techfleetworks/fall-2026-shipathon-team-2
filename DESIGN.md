# DESIGN.md — Plenty (Team 2)

> **Status: recreated from the Figma "Deals near Palms" mockup
> (node 165:310, "Green & Purple"), brand colors and font confirmed by the team.**
> This replaces the old "Sunlit Neighborhood Market" spec. Type sizes remain
> approximate until the finished frames land.

## 1. Visual thesis & vibe
- **Aesthetic:** clean, bright, modern marketplace — white canvas, confident
  **green** brand with a **purple** savings accent. Friendly and scannable
  one-handed, not warm/rustic (that was the old direction).
- **Dignified, not charity:** deals are framed as smart local savings
  ("Save $9", "60% off"), never pity.
- **Changed from the old spec:** serif headings (Lora) and the warm oat canvas
  are *out*; this look is a white-background sans-serif system with green +
  purple.

## 2. Color palette

> Hex values are eyeballed from the mockup ⚠️ — confirm/adjust.

### Brand
| Token | Hex | Use |
|---|---|---|
| `green-600` (primary) | `#1C8057` | Brand green: active tab, active nav, "Palms" highlight, primary CTA fill |
| `green-700` (deep) | `#155E40` *(derived)* | Discount badge fill ("60% off"), pressed states |
| `green-100` (tint) | `#D7EBD2` | Active nav pill background, map placeholder, soft fills |
| `purple-600` (accent) | `#5D2E77` | Savings ("Save $9"), "Filter" outline + text, secondary accents |
| `purple-50` (tint) | `#EFE9F3` *(derived)* | Soft purple fills if needed |

### Neutrals
| Token | Hex | Use |
|---|---|---|
| `canvas` | `#F4F1E9` | Page background (warm cream) |
| `card` | `#FFFFFF` | Card surface (pops against the cream canvas) |
| `ink` | `#1A1A1A` | Primary text, headings, prices |
| `ink-secondary` | `#6B7280` | Subtitles, store detail text |
| `ink-muted` | `#9CA3AF` | Strikethrough reg price, hints |
| `border` | `#E5E7EB` | Card + chip borders, dividers |
| `thumb-bg` | `#EDE7DD` | Image-placeholder background (sand/beige) |

**Rule:** green = brand/positive/active; purple = savings/secondary; never swap
them. Status is never color-only — pair with icon or label (e.g. "60% off" text
in the badge, not just a green dot).

## 3. Typography

**Font (confirmed): the system font stack — SF Pro on Apple devices, Inter everywhere else.**
Use `-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif` (Inter must come
before `system-ui`, or non-Apple devices grab Segoe/Roboto first). iPhones/iPads render real SF Pro
(matches the mockup, free via the OS); Android/desktop/web render Inter (a near-identical
look-alike). Load Inter as a webfont for non-Apple platforms. The old serif (Lora) and
mono (JetBrains) are dropped — one sans family, weights 400/500/600/700.

| Role | Size ⚠️ | Weight | Example in mockup |
|---|---|---|---|
| Screen title (H1) | ~28px | 700 | "Deals near Palms" |
| Section header (H2) | ~20px | 700 | "4 deals nearby" |
| Card title | ~17px | 600–700 | "Sunrise Bakery · 0.6 mi" |
| Price | ~22px | 700 | "$6" |
| Body / meta | ~15–16px | 400–500 | "Bread + produce bag" |
| Small / label | ~13px | 500–600 | "60% off", nav labels, tab labels |

- Body text minimum **16px** to avoid mobile zoom.
- Prices use the same sans at bold weight (no separate mono font in this look).

## 4. Spacing, geometry & radii

| Token | Value | Use |
|---|---|---|
| `radius-card` | `16px` ⚠️ | Deal cards, bottom sheet |
| `radius-thumb` | `12px` | Image thumbnails |
| `radius-pill` | `999px` | Buttons, chips, badges, dropdowns |
| `pad-card` | `16px` | Internal card padding |
| `gap-card` | `12–16px` | Vertical gap between cards |
| Spacing scale | 4px base | 4 / 8 / 12 / 16 / 20 / 24 |
| Elevation | `0 2px 8px rgba(0,0,0,0.05)` | Subtle card/sheet shadow |

## 5. Component tokens

**Button — primary** (e.g. "Reserve")
- Fill `green-600`, text white, `radius-pill`, min height **48px**, bold label.

**Button — secondary / outline** (e.g. "Filter")
- White fill, `1px purple-600` border, `purple-600` text, `radius-pill`, 48px.

**Chip / dropdown** (e.g. "Palms ▾")
- White fill, `1px border`, `radius-pill`, `ink` text, ~40–44px tall.

**Tabs** (Map / List)
- Active: `green-600` text + 2px `green-600` underline.
- Inactive: `ink-secondary`, no underline.

**Deal card**
- White, `1px border`, `radius-card`, `pad-card`, subtle shadow.
- Left: thumbnail `radius-thumb` on `thumb-bg`.
- Title `ink` 600; subtitle `ink-secondary`.
- Price `ink` 700; "reg $X" `ink-muted` strikethrough; "Save $X" `purple-600`.
- Discount badge: `green-700` fill, white text, `radius-pill`, small.

**Bottom nav** (Deals / My pickups / Favorites / Account)
- 4 items, icon + label.
- Active: `green-600` icon + text, `green-100` rounded pill behind the icon.
- Inactive: `ink-secondary`.

### 5a. Component sizing (px) ⚠️ heights firm, paddings approximate

> Heights follow the ≥48px tap rule; horizontal paddings/sizes are read from the
> mockup and can be nudged. All interactive targets ≥48×48px with ≥8px spacing.

| Component | Height | Horiz. padding | Label | Radius | Notes |
|---|---|---|---|---|---|
| Button — primary | 48px | 24px | 16px / 600 | pill | Green fill, white text; full-width on CTAs |
| Button — small | 40px | 16px | 14px / 500 | pill | Secondary/inline actions |
| Button — outline (Filter) | 44px | 20px | 15px / 600 | pill | Purple border + purple text |
| Dropdown chip (Palms ▾) | 44px | 16px | 15px / 500 | pill | White, 1px border, caret icon 16px |
| Filter chip (Category…) | 40px | 16px | 14px / 500 | pill | White, 1px border |
| Discount badge (60% off) | 24px | 10px | 13px / 600 | pill | Green-700 fill, white text |
| Tab (Map / List) | 40px tap | — | 16px / 600 | — | Active: 2px underline; 16px gap between tabs |
| Input / search | 48px | 16px | 16px / 400 | 12px or pill | Leading icon 20px |
| Card thumbnail | 80×80px | — | — | 12px | On `thumb-bg`; icon 28px when empty |
| Deal card | auto | 16px (all sides) | — | 16px | 12–16px gap between cards |
| Bottom nav bar | 56–64px | — | 12px / 500 | — | Icons 24px; active icon in `green-100` pill (~44×32px) |

**Icon sizes:** 24px (nav, primary), 20px (inline with text), 16px (small, carets).
**Touch spacing:** ≥8px between any two adjacent tappable elements.
**Full-width CTA:** primary reserve/confirm buttons span the content width minus the 16px side gutter.

## 6. Core UX standards (unchanged from before — still enforce)
- **Thumb-zone:** primary actions reachable at the bottom; targets ≥48×48px, 8px+ apart.
- **Progressive disclosure:** ≤4 data points per card; details in the detail sheet; ≤3–4 filter chips.
- **WCAG AA:** 4.5:1 text / 3:1 UI contrast; never color-only.
- **Error prevention:** single-tap reserve + clear cancellation; always show status
  ("2 bags left", "Reserved · Held until 6:15 PM"); graceful empty states.

---

## 7. Tailwind v4 token block (`@theme`)

> This project is **Tailwind v4** (CSS-first) — there is **no `tailwind.config.js`**.
> Paste this into `src/app/globals.css`. Tailwind auto-generates utilities like
> `bg-green-600`, `text-purple-600`, `rounded-card`, `font-sans`.

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-green-100:  #D7EBD2;
  --color-green-600:  #1C8057;
  --color-green-700:  #155E40;
  --color-purple-50:  #EFE9F3;
  --color-purple-600: #5D2E77;

  /* Neutrals */
  --color-canvas:        #F4F1E9;
  --color-card:          #FFFFFF;
  --color-ink:           #1A1A1A;
  --color-ink-secondary: #6B7280;
  --color-ink-muted:     #9CA3AF;
  --color-border:        #E5E7EB;
  --color-thumb-bg:      #EDE7DD;

  /* Typography — SF Pro on Apple devices, Inter elsewhere */
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif;

  /* Radii */
  --radius-card:  16px;
  --radius-thumb: 12px;
  --radius-pill:  999px;

  /* Shadow */
  --shadow-card: 0 2px 8px rgb(0 0 0 / 0.05);
}
```

## 8. What still needs confirming (⚠️)
1. ~~Exact brand hex~~ ✅ confirmed by team (green `#1C8057`, purple `#5D2E77`,
   tint `#D7EBD2`, canvas `#F4F1E9`). Deep green `#155E40` derived — confirm if a
   specific badge green is wanted.
2. ~~Font family~~ ✅ confirmed: `-apple-system → Inter` (SF Pro on Apple, Inter elsewhere).
3. **Type sizes** — approximate; adjust to the finished frames.
4. **Is node 165:309 (Too Good To Go) just inspiration?** Assumed yes.
