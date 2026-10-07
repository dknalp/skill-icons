Plan saved to: ~/.claude/plans/fluffy-mapping-milner.md · /plan to edit
Plan: Next.js + Tailwind CSS Frontend for skill-icons

Context

The skill-icons repo currently has only the API worker (index.js) and SVG assets. There is no frontend in the repo — the existing skillicons.dev site is a separate Nuxt app not included here. The goal is to build a modern Next.js + Tailwind CSS website with three sections: a landing page, a docs page, and an interactive icon editor/exporter.

---

Structure

Create a frontend/ subdirectory inside the existing repo:

frontend/
├── app/
│   ├── layout.tsx          # Root layout, font, global nav
│   ├── page.tsx            # Landing/home page
│   ├── docs/page.tsx       # Docs page
│   └── editor/page.tsx     # Icon editor page (main feature)
├── components/
│   ├── Navbar.tsx
│   ├── IconPicker.tsx      # Searchable grid of all 326 icons
│   ├── IconCard.tsx        # Single icon — click to select/deselect
│   ├── EditorControls.tsx  # Theme toggle, perline slider, search
│   ├── PreviewPanel.tsx    # Live <img> preview of generated SVG
│   └── ExportPanel.tsx     # Copy URL / Markdown / HTML
├── lib/
│   └── api.ts              # Typed fetch helpers for the worker
├── next.config.ts          # image domains, API proxy rewrite
├── tailwind.config.ts
└── package.json

---

Pages

1. Landing page (app/page.tsx)

- Hero with title, one-liner description, CTA button → /editor
- Short animated preview showing an example SVG icon strip
- Three feature highlights (Browse 326 icons, Theme support, Copy & paste)

2. Docs page (app/docs/page.tsx)

Server component. Content mirrors the README sections:
- Specifying icons (?i=js,html,css)
- Theme param (?t=light / ?t=dark)
- Per-line param (?perline=3)
- Full icon list table (fetched from /api/icons at request time, rendered server-sid
- Short-name alias table (hardcoded, same as shortNames in index.js)

3. Editor page (app/editor/page.tsx)

Split-pane layout:
- Left panel — IconPicker: search box + scrollable grid of all icons. Each IconCard , toggles selected state on click. Selected icons highlighted with a ring.
- Right panel — stacked vertically:
  - EditorControls: theme toggle (dark/light), perline slider (1–50)
  - PreviewPanel: live <img> pointing at http://localhost:8787/icons?i=...&t=...&perline=... — updates as selections change
  - ExportPanel: three copy buttons — Copy URL, Copy Markdown badge, Copy HTML <img>

---

Data flow

Icon list — fetched once in a server component or generateStaticParams from GET /apis). Passed as a prop to the client IconPicker.

Icon thumbnails in the picker — each IconCard renders:
<img src="http://localhost:8787/icons?i={name}&t={theme}&perline=1" />
This hits the local worker and returns a single-icon SVG. No need to load dist/icons.

Editor preview — a single <img> whose src is recomputed from (selectedIcons[], themeevery change.

Export strings generated client-side:
- URL: https://skillicons.dev/icons?i=react,ts&t=dark&perline=15
- Markdown: [![My Skills](https://skillicons.dev/icons?i=react,ts)](https://skillico
- HTML: <img src="https://skillicons.dev/icons?i=react,ts" />

API base URL — stored in a single lib/api.ts constant so swapping dev↔prod is one edit. Dev points at http://localhost:8787, prod at https://skillicons.dev.

---

next.config.ts

Add a rewrite so <Image> from next/image works without unoptimized:
images: { remotePatterns: [{ hostname: 'localhost' }, { hostname: 'skillicons.dev' }

---

Setup commands (to be run after creating files)

cd frontend
npm install
npm run dev   # starts on http://localhost:3000

The worker must be running on port 8787 in parallel for the editor to function local

---

Verification

1. npm run dev in frontend/ starts without errors
2. Landing page loads at http://localhost:3000
3. Editor page: selecting 3 icons + changing theme updates the preview image
4. "Copy Markdown" copies a valid badge string
5. Docs page shows the full icon list table
6. npm run build passes (no type errors, no missing env vars)
