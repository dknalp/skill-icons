# Skill Icons — Improvement Plan

## Tasks

- [x] 1. Fuzzy search in editor library (shortNames + substring)
- [x] 2. URL state sync (selected icons, theme, perline in query params)
- [x] 3. Drag-to-reorder selected icons in editor preview
- [x] 4. "Copy image" button (SVG blob to clipboard)
- [x] 5. Check and add missing popular icons (Ollama, Cursor, Warp, Zed, Bun — Playwright not in simple-icons)

---

## 1. Fuzzy search

**File:** `components/editor/LibraryPanel.tsx`

Current: `icons.filter(n => n.includes(q))`

Improved: also check shortNames values — if query matches a shortName key, include the target icon. Example: typing "ts" matches "typescript" via shortNames.

Also rank results: exact prefix matches first, then contains, then shortName alias matches.

**Test:** type "ts" → typescript appears. Type "rr" → reactrouter appears. Type "react" → react, reactrouter, reactivex all appear.

---

## 2. URL state sync

**File:** `components/editor/EditorShell.tsx`

On mount: read `?i=`, `?t=`, `?perline=` from `useSearchParams()` and initialize state.
On change: use `router.replace()` with updated params (debounced 300ms so every click doesn't thrash history).

Export URL uses `skillicons.dev` already — the editor URL uses `localhost:3000/editor?i=...` which is shareable within the dev environment.

**Test:** select 3 icons → URL updates. Refresh page → icons still selected.

---

## 3. Drag-to-reorder

**File:** `components/editor/CanvasPanel.tsx`

Use HTML5 drag-and-drop API (no extra deps). Each `IconCell` gets `draggable`, `onDragStart`, `onDragOver`, `onDrop` handlers. Drop reorders the `selected` array in `EditorShell`.

Visual: dragged icon gets 50% opacity, drop target gets a white ring.

**Test:** drag react icon to position 3 → order updates → preview reorders instantly.

---

## 4. Copy image button

**File:** `components/editor/SettingsPanel.tsx`

Fetch the SVG URL, convert to a Blob, write to clipboard as `image/png` using `ClipboardItem`. Since SVG→PNG requires a canvas draw, the flow is:
1. Fetch SVG as text
2. Create `<img>` from SVG blob URL
3. Draw to `<canvas>`
4. `canvas.toBlob()` → `ClipboardItem({ 'image/png': blob })` → `navigator.clipboard.write()`

**Test:** click "Copy Image" → paste into Figma/Notion → image appears.

---

## 5. Missing popular icons

Check which of these are missing and add good SVGs:
- Ollama
- Cursor (the AI editor)
- Warp (terminal)
- Zed (editor)
- Playwright
- Bun (check if current one renders correctly)

**Source:** simple-icons.org has MIT-licensed SVGs for most. Resize to 256×256, remove style blocks, namespace IDs, run node build.js, test.

**Test:** `http://localhost:8787/icons?i=ollama,cursor,warp,zed` renders all four correctly.
