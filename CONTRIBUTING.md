# Contributing to Skill Icons

Thank you for wanting to improve Skill Icons! This guide covers everything you need to add a new icon or fix an existing one.

---

## Before you start

- **Search open issues and PRs first** — someone may already be working on the same icon.
- Icons must be **original work or freely licensed** (MIT, Apache 2.0, CC0, or similar). Do not trace or copy proprietary artwork.
- Keep SVGs **clean and minimal** — no embedded raster images, no `<script>`, no external `href` references.

---

## Adding a new icon

### 1. Prepare your SVG

All icons must be `256 × 256` with `viewBox="0 0 256 256"`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <!-- your paths here -->
</svg>
```

Rules:
- **No `<style>` blocks** — CSS class names collide when icons are composited into a single SVG sheet. Use inline `fill="..."` attributes instead.
- **No `<?xml ...?>` declarations** — not needed and adds noise.
- **Namespace gradient/filter IDs** — if you use `id="grad1"`, prefix it with a short unique string (e.g. `id="myicon_grad1"`) so IDs don't conflict with other icons on the same sheet.
- **Themed icons** — if the icon looks different on dark vs light backgrounds, create two files: `Name-Dark.svg` and `Name-Light.svg`. If it looks the same on both, create a single `Name.svg`.

### 2. Name your file

Follow the existing naming convention exactly:

| Type | Filename |
|---|---|
| Single (unthemed) | `IconName.svg` |
| Dark variant | `IconName-Dark.svg` |
| Light variant | `IconName-Light.svg` |

Use **TitleCase** — no hyphens in the name itself (only `-Dark` / `-Light` suffixes), no spaces, no lowercase-only names.

✅ `ReactRouter-Dark.svg`, `GoogleColab.svg`
❌ `react-router-dark.svg`, `googlecolab.svg`, `Google-Colab-Dark.svg`

### 3. Place the file

Drop your `.svg` file(s) into the `icons/` directory at the repo root.

### 4. Rebuild locally

```bash
node build.js
```

This regenerates `dist/icons.json`. Verify your icon appears:

```bash
node -e "const i=require('./dist/icons.json'); console.log(Object.keys(i).filter(k=>k.includes('youriconname')))"
```

### 5. Add a short-name alias (optional)

If your icon name is long or has a common abbreviation, add an alias to the `shortNames` object in `index.js`:

```js
const shortNames = {
  // ...existing aliases...
  rr: 'reactrouter',   // example
};
```

### 6. Test it

Start the local dev server and check your icon renders correctly:

```bash
# Bundle and start the worker
npx esbuild index.js --bundle --outfile=dist/worker.js --platform=browser --format=iife
./node_modules/.bin/miniflare dist/worker.js --wrangler-config wrangler.dev.toml --no-update-check --port 8787 --upstream https://skillicons.dev

# Test in browser
open "http://localhost:8787/icons?i=youriconname"
```

Check both themes if applicable:
```
http://localhost:8787/icons?i=youriconname&t=dark
http://localhost:8787/icons?i=youriconname&t=light
```

### 7. Open a pull request

- **Title:** `feat: add <IconName> icon` or `fix: update <IconName> icon`
- **Include:** a short description of what the icon represents and its license/source.
- **One icon per PR** where possible — it keeps review simple.

---

## Fixing an existing icon

Same workflow as above — edit the file in `icons/`, rebuild with `node build.js`, test locally, open a PR with title `fix: <description>`.

Common issues to fix:
- Wrong `viewBox` dimensions (should be `0 0 256 256`)
- Embedded `<style>` blocks (convert to inline attributes)
- Non-namespaced gradient/filter IDs (prefix them)
- Low resolution or pixelated paths

---

## What we don't accept

- Icons that require authentication or a paid account to reproduce
- Logos with trademark restrictions that prohibit reproduction
- Duplicate icons (check the [full icon list](https://skillicons.dev/icons?i=all) first)
- Icons with embedded raster images (`<image>` tags)
- Files over ~50 KB (optimize with [SVGO](https://svgo.dev) first)

---

## Questions?

Open an issue — we're happy to give feedback before you spend time on a full icon.
