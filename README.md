# Xai — Intelligence Workspace

A single-page, high-fidelity product experience for **Xai**, demonstrating the
transformation *raw data → structured intelligence → actionable insight → AI
automations* through motion, geometry, and a working product-quality UI.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
**React Three Fiber / Three.js**, **Framer Motion**, and **GSAP + ScrollTrigger**.

---

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The project also builds clean for production:

```bash
npm run build && npm start
```

> **Fonts:** this build ships with a system-font fallback stack so it compiles
> without outbound network access. With internet available at build time,
> swap in `next/font/google` for pixel-exact Space Grotesk / Inter / IBM Plex
> Mono — the exact code to paste in is commented at the top of `app/layout.tsx`.

---

## What's here

| Section | File | What it demonstrates |
|---|---|---|
| Hero | `components/Hero/` | R3F particle field of 2,200 points that morphs from a chaotic "raw data" cloud into a structured grid as you scroll, with cursor-driven parallax |
| Insight Flow | `components/InsightFlow/` | GSAP `ScrollTrigger`-pinned horizontal track through **Ingest → Analyze → Generate**, with an SVG connective line whose `stroke-dashoffset` is scrubbed by scroll |
| Dashboard Preview | `components/Dashboard/` | A real mock product UI — sidebar nav, tab switching with a Framer Motion `layoutId` pill, sparkline charts, an insights table, automations list — not marketing cards |
| Signature interaction | `components/Signature/` | The "wow moment": a 72-node data cluster that self-organizes into a three-ring structured graph on scroll, with live-updating monospace coordinate readouts on key nodes and pointer-driven orbital parallax |

Every animated value (`progress`, pointer position) is computed in plain React
hooks (`lib/useScrollProgress.ts`) and passed into the R3F scenes via refs, so
`useFrame` reads live data every frame without triggering React re-renders —
the reason the 3D stays smooth while scrolling.

---

## Design system (in place of a Figma file)

This environment doesn't have Figma access, so the design system below is the
source of truth this build was implemented against — treat it as the token
sheet you'd otherwise pull from a Figma library. It's precise enough to
recreate in Figma directly (Auto Layout spacing, color styles, and type
styles map 1:1 onto `tailwind.config.ts`).

**Brief interpreted as:** a calm, technically confident product surface for
data/ops decision-makers evaluating an AI intelligence platform — not a
marketing landing page. The visual language borrows from instrumentation and
graph theory (coordinate grids, node/edge diagrams, monospace readouts)
because that's Xai's actual subject matter: turning scattered data into
legible structure.

### Color — 6 named values

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#0A0B0D` | Page background |
| `ink-900` / `ink-800` | `#111318` / `#1B1E26` | Panels, cards, borders |
| `paper-100` | `#EDEFF3` | Primary text, node "structured" color |
| `mist-400` | `#8A93A6` | Secondary/body text |
| `signal-500` | `#5B8CFF` | Primary accent — marks anything mid-transformation (edges, active states, links) |
| `insight-500` | `#F2A93B` | Reserved exclusively for the moment data *becomes* an insight (rare, high-impact tags, the amber particles in the hero) |

Deliberately **not** the near-black + acid-green/vermilion or warm-cream +
terracotta palettes that read as generic "AI demo" defaults — signal-blue was
chosen because it's the color of a cursor, a status light, a wire: it reads
as instrumentation, not branding.

### Type — 3 roles

- **Display — Space Grotesk** (weights 400/500/700): geometric, slightly
  technical, used with restraint at the type-scale extremes (H1/H2 only).
- **Body — Inter** (400/500/600): neutral, highly legible at small sizes for
  descriptions and UI copy.
- **Utility/data — IBM Plex Mono** (400/500): every number, coordinate,
  status label, and timestamp. This is what makes the dashboard and the 3D
  coordinate readouts feel like real instrumentation instead of decoration.

Type scale follows Tailwind defaults (`text-sm` → `text-7xl`) with
`tracking-tightest` (`-0.04em`) applied to display headlines only.

### Layout

- Desktop-first, 14 (`px-14`) / 6 (`px-6` mobile) horizontal rhythm.
- A **1px coordinate grid** (`bg-coord-grid`, 48px cells, 5% opacity) underlays
  every full-bleed section — a structural device that encodes the product's
  actual subject (structured data), not decoration.
- Sections: Hero (sticky 3D, 180vh scroll) → Insight Flow (pinned horizontal,
  GSAP-scrubbed) → Dashboard Preview (static, in-flow) → Signature interaction
  (sticky 3D, 220vh scroll) → Footer.

### Signature element

The node-cluster-to-graph morph in `components/Signature/ClusterScene.tsx` is
the one deliberate risk this design spends its boldness on: a genuine
physics-free interpolation (not a canned animation) between a chaotic point
cloud and a three-ring graph layout, scrubbed 1:1 with scroll position, with
five nodes wearing live monospace coordinate tags. Everything else on the
page — dashboard, insight flow, typography — stays quiet and disciplined so
this moment reads as the thesis.

---

## Architecture notes

- **`lib/useScrollProgress.ts`** — two small hooks (`useScrollProgress`,
  `usePointerNormalized`) shared by both R3F sections. Scroll math lives once,
  outside Three.js, and is fed in via `useRef` to avoid re-render thrash.
- **Component boundaries** mirror the four required sections 1:1, each in its
  own folder with a `SceneOrPanel` + orchestrating wrapper, so any section can
  be iterated on independently.
- **No animation library fights the others**: Framer Motion owns discrete UI
  transitions (page-load stagger, tab switches, hover), GSAP/ScrollTrigger
  owns the pinned scroll timeline (the one thing it does better than anything
  else), and Three.js/R3F owns continuous per-frame 3D state. Nothing
  double-drives the same property.
- **Reduced motion**: `prefers-reduced-motion` is respected globally in
  `app/globals.css`.
- **Accessibility floor**: visible focus rings (`:focus-visible`), semantic
  landmarks, and real button/anchor elements throughout — no click-handlers
  on generic `div`s.

## Known follow-ups if you keep building this

1. Swap the font loader as noted above once you have build-time internet.
2. The dashboard uses static mock data (`components/Dashboard/data.ts`) —
   wire to a real API when ready.
3. `ClusterScene`'s edge list is recomputed on mount with an O(n²) nearest-
   neighbor pass; fine at 72 nodes, worth memoizing further if you scale the
   node count up.
